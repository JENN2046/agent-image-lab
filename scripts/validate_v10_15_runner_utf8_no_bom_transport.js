const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function validateRunner(relativePath) {
  const content = read(relativePath);
  const stdinRedirectIndex = content.indexOf("$psi.RedirectStandardInput = $true");
  const payloadBytesIndex = content.indexOf("$payloadBytes = [System.Text.UTF8Encoding]::new($false).GetBytes($payload)");
  const baseStreamWriteIndex = content.indexOf("$process.StandardInput.BaseStream.Write($payloadBytes, 0, $payloadBytes.Length)");
  const baseStreamFlushIndex = content.indexOf("$process.StandardInput.BaseStream.Flush()");
  const processStartIndex = content.indexOf("$process = [System.Diagnostics.Process]::Start($psi)");
  const stdinCloseIndex = content.indexOf("$process.StandardInput.Close()");

  assert(stdinRedirectIndex >= 0, `${relativePath} must redirect standard input.`);
  assert(payloadBytesIndex >= 0, `${relativePath} must encode payload as UTF-8 no BOM bytes.`);
  assert(baseStreamWriteIndex >= 0, `${relativePath} must write UTF-8 payload bytes to stdin BaseStream.`);
  assert(baseStreamFlushIndex >= 0, `${relativePath} must flush stdin BaseStream after writing payload.`);
  assert(processStartIndex >= 0, `${relativePath} must start the plugin process through ProcessStartInfo.`);
  assert(
    processStartIndex < payloadBytesIndex && payloadBytesIndex < baseStreamWriteIndex && baseStreamWriteIndex < baseStreamFlushIndex && baseStreamFlushIndex < stdinCloseIndex,
    `${relativePath} must start the process, encode payload bytes, write/flush BaseStream, then close stdin.`
  );
  assert(
    !content.includes("$psi.StandardInputEncoding = [System.Text.Encoding]::UTF8"),
    `${relativePath} must not use BOM-capable Encoding.UTF8 for stdin.`
  );
  assert(
    !content.includes("$psi.StandardInputEncoding = [System.Text.UTF8Encoding]::new($false)"),
    `${relativePath} must not rely on ProcessStartInfo.StandardInputEncoding because Windows PowerShell 5.1 may not expose it.`
  );
  assert(!content.includes("$process.StandardInput.Write($payload)"), `${relativePath} must not use TextWriter.Write for JSON payload stdin.`);
  assert(content.includes("$process.StandardInput.Close()"), `${relativePath} must close stdin after writing payload.`);

  return {
    relative_path: relativePath,
    redirect_standard_input: true,
    payload_encoded_utf8_no_bom: true,
    payload_written_to_base_stream: true,
    base_stream_flushed_before_close: true,
    avoids_processstartinfo_standard_input_encoding: true,
    avoids_textwriter_write_for_payload: true,
    avoids_encoding_utf8_for_stdin: true
  };
}

function main() {
  const runners = [
    "scripts/run_v0_7_photo_studio_os_real_execution.ps1",
    "scripts/run_v0_10_gptimagegen_real_execution.ps1"
  ].map(validateRunner);

  const runState = read(".agent_board/RUN_STATE.md");
  const validationLog = read(".agent_board/VALIDATION_LOG.md");
  const boardText = `${runState}\n${validationLog}`;

  assert(
    boardText.includes("v10.15") && boardText.includes("UTF-8 no BOM"),
    ".agent_board must record the v10.15 UTF-8 no BOM runner transport patch."
  );
  assert(
    boardText.includes("actual generation calls: 0") && boardText.includes("image created: false"),
    ".agent_board must record that v10.15 did not generate images."
  );

  process.stdout.write(`${JSON.stringify({
    passed: true,
    v10_15_runner_utf8_no_bom_transport: {
      runners,
      generation_performed: false,
      api_called: false,
      image_created: false,
      daily_note_called: false,
      vcp_memory_written: false,
      validation_scope: "local runner transport UTF-8 no BOM byte-write only"
    }
  }, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
