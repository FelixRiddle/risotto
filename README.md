# Server generalization

This is a generalization of things I often do with express servers.

Because I ended up repeating code by copy pasting, I've done this project to generalize these aspects:
- Dynamic server configuration

If anther server's ip / port changes this one has a route to discover it.
That which other servers will send a request to.
<!-- 
This was before
But servers can be running behind a protected [Higher Router], so there's no need for this.
That's why authentication and real estate should be separated, because [Access Control] is a different property altogether.

For this two things have to happen:
1) ACL's and admin users are required
2) '/srv' base route is taken.
-->

Your app will not be able to use '/srv' because it's reserved for server configuration, like discovery.

- Server creation
- Middleware usage
- Users folder
- Protection
- Server clustering
- When clustering use env port

If 'PORT' is set, the server will use it.

# Environment variables

This server will use the following environment variables.

When clustering

```bash
# If clustered
CLUSTERED=1
# To prevent clusters from using different ports
# It will use some random port above 40000
PORT=40000
```
