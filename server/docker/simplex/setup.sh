#!/usr/bin/expect -f
set timeout 30

# Check if profile already exists
if {![file exists "/root/.simplex/simplex_v1_agent.db"]} {
    puts "Setting up profile with XMRChat display name..."
    
    # Check if simplex-chat binary exists and is executable
    if {[file executable "/usr/local/bin/simplex-chat"]} {
        puts "simplex-chat binary found and executable"
    } else {
        puts "ERROR: simplex-chat binary not found or not executable"
        exit 1
    }
    
    # Try to spawn simplex-chat with full path
    spawn /usr/local/bin/simplex-chat
    if {$spawn_id == 0} {
        puts "ERROR: Failed to spawn simplex-chat"
        exit 1
    }
    
    expect "display name:"
    send "XMRChat\r"
    expect eof
    puts "Profile setup complete."
} else {
    puts "Profile already exists, skipping setup."
}

# Start the server on port 5226
# puts "Starting simplex-chat server on port 5226..."
# exec simplex-chat -p 5226