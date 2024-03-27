# TODO

- [x] Update environment variables before starting the server
- [x] Router
    - [x] Setup middleware
    - [x] Mount routes

I've mixed those two and wasted hours


## [Bug] Discovery doesn't work for clustering

- [ ] [Bug] I think port discovery doesn't work for clustering

I can still however

- [ ] Wrap good roots api
    - [ ] On error do the following actions
        - [ ] Update locations
        - [ ] Try again
        - [ ] On failure again then response to the request with an internal error(500).

However this has to be done not here but in the app that uses this library

Add [Solved when finished]
