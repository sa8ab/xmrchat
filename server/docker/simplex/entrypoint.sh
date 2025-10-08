#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-5226}"
PORT_SOCAT="${PORT_SOCAT:-5225}"
DISPLAY_NAME="${DISPLAY_NAME:-XMRChat}"

if [ ! -f "/root/.simplex/simplex_v1_agent.db" ]; then
  echo "[entrypoint] First run: creating profile with display name: ${DISPLAY_NAME}"
  
  expect <<EOF
spawn simplex-chat
expect "display name:"
send "${DISPLAY_NAME}\r"
expect {
    "Welcome ${DISPLAY_NAME}!" { }
    timeout { puts "Timed out waiting for welcome message"; }
}
sleep 1
EOF

  echo "[entrypoint] Profile created."
fi

echo "[entrypoint] Starting simplex-chat on port ${PORT}"

simplex-chat -p ${PORT} &
socat TCP-LISTEN:${PORT_SOCAT},fork,reuseaddr TCP:127.0.0.1:${PORT}