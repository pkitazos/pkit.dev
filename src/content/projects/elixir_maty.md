---
name: elixir_maty
href: https://github.com/pkitazos/elixir_maty
status: active
order: 1
stack: [Elixir]
---
A static checker for communication patterns in Elixir programs, built for my MSci project at Glasgow. It brings Multiparty Session Types to Elixir following the Maty language design: you bring a verified protocol, write actors that play roles in it, and every message handler is given a session type.

The type checker runs at compile time, so an actor that doesn't follow its session type simply won't compile. The calculus and typing rules are still being written up, and the repo ships a couple of runnable examples (two buyers splitting the price of a book, and a queue that holds messages that arrive out of order).
