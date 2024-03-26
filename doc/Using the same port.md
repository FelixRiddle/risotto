# Using the same port

I'm having trouble with this one, subsequent forks of the main thread have to use the same port obviuously, but this is hard, I thought env would work, but it doesn't.

# Save / Read server location

- [x] Write app location to a file when in the main thread.
- [x] Forks, will use that location for settings their port.

# [Doesn't work] Environment variables

This server will use the following environment variables.

When clustering

```bash
# If clustered
CLUSTERED=1
# To prevent clusters from using different ports
# It will use some random port above 40000
PORT=40000
```

All clusters reset environment variables, they won't use this one.
