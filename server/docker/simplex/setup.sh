#!/usr/bin/expect -f
set timeout 30

# Check if profile already exists
if {![file exists "/root/.simplex/simplex_v1_agent.db"]} {
    puts "Setting up profile with XMRChat display name..."
    spawn simplex-chat
    expect "display name:"
    send "XMRChat\r"
    expect eof
    puts "Profile setup complete."
}

# Start the server on port 5226
# puts "Starting simplex-chat server on port 5226..."
# exec simplex-chat -p 5226