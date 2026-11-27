---
name: cx
href: https://github.com/pkitazos/cx
status: wip
order: 4
stack: [Golang, Charm]
---

A command line tool for cutting and pasting files and directories around the terminal, written in Go. `cx path/to/file` puts something on a clipboard, and `cx paste` moves the most recent item to wherever you are. Add `--persist` to keep pasting copies of it instead of moving it.

The clipboard is kept in `~/.cx_clipboard.json`, so it survives between sessions, and `cx list` and `cx clear` let you look at it or empty it.
