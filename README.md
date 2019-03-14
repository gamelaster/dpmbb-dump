# DMPBB-Dump

This script automatically dumps timetables of City Tranpsort in Banska Bystrica from their website, which using some security to make dumping/downloading harder for bots. (This script don't parsing the timetables, only dumps them)

**NOTE:** At the time of publishing the script, it looks like they removed the anti-bot script (or it's enabled only for suspicious IP addresses). Anyway, this tool is still able to dump all pages with timetables.

# Usage

```bash
npm install
npm start
```

The pages is saved to `data` folder.

# Security

The website using some old paid JS script, which "testing" browser functions and if everything goes well, it set the cookie and refreshed page. Thanks to cookie, server started to returning real webpage instead of security script. I was trying to search if there's some workaround, I also found it's known anti-bot script, anyway nobody provided the solution and reverse engineering of the script would be really painful. The solution is simple, just launch the website in real browser which supports automitazation, so Electron. 
