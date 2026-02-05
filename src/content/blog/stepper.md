---
title: Building a λ-calculus stepper
date: 2026-02-05
draft: true
---


While I was learning about the lambda calculus, I would often find myself having to write out lambda expressions on paper and then manually write my reductions one line at a time until I reached the final reduced term.

-- picture here

And sometimes (often) I would make mistakes and have to rewrite things. It's just not a particularly scalable solution. So I figured I'd build an interpreter for it myself but one which only performs one reduction step at a time.

As far as I could tell there were 2 ways for me to do this:
1. Build a regular interpreter, but have it log every reduction step it makes and then once I have that list of steps I would just build a UI which is a pointer to a particular frame in the complete list of steps. The problem with this is that it required that all expressions entered reduce to a terminal state. This just isn't true if all lambda terms. Think of the Y combinator for example (the reason I'm building this) it reduces forever. So our program would never terminate and so the complete list of terms would never be produced (because no such list can be represented).
2. This leaves option 2, build a stepper.

A stepper, or stepping evaluator does what it sounds like. It takes a term and performs one reduction step. The problem with this is that I would need to define what the correct order of reductions is.

because the lambda calculus is a pure language it's not like the order matters, but still I wanted to have predictable results when stepping through a reduction.

For example:

-- super long expression example where reductions are happening in one place and then jump to another place.


# How does a stepper work

Let's say we have some type for our terms.

```rust
enum Term { 
    // different types of terms go here
}
```

Then our stepper might be a function which looks like this:

```rust
fn step(term: Term) -> Term
```

It's just a function which takes some term to some other term. What kind of term to what kind of term? Well that depends on the term that goes in.

In the Untyped Lambda Calculus we only have 3 kinds of terms:

1. Variables
2. Lambda expressions
3. Function application

So filling in our terms type:

```rust
enum Term {
    Var(String),
    Lambda(String, Term)
    App(Term, Term)
}
```

In reality we probably need to add some boxes around these because the size of our terms aren't really known ahead of time, but for the sake of this write-up let's not worry about those.

So a stepper is a function that takes one term and performs one reduction step. 

Let's consider how our stepper would handle each kind of term.

## Variables

How do we reduce the following expression further?

```
x
```

Right, we can't. So this case is handled quite easily, our stepper would not be able to reduce a variable any further.

## Lambda Expressions

How do we reduce the following expression further?

```
λx.x
```

Can't do it. Cool, this also stays the same, except hang on. What about a function like this?

```
λx.(λy.y) x
```

Is this not reducible? Yes it is. So the body of a lambda expression can be reduced further (sometimes). 

Variables (1) and Lambda Terms (2) can't be reduced further. The only type of term that can be reduced is a function application term.

and really the only kind of reduction we're able to do at that point is if the LHS term is a lambda expression. so really for our stepper to work we need to write a function that takes a lambda term and some arbitrary term t.

```
sub(x, body, t)
```

and what it should do is sub t for x in body.

but we can't be substituting stuff in there willy nilly. We need to be careful not to use names that we're not allowed to.

imagine we have

```
a := λx.λy.x y
```

as our LHS, and
```
t := y
```

so just the variable y

if we were to substitute every occurrence of x for y as is we would get a new term

```
a' := λy. y y
```
which is not semantically the same.

so we need to do some renaming.

we can either rename the inner y or the outer y. the labels inner and outer are not particularly helpful so let's call them the LHS and RHS ys from the term we originally found them in.

we can't rename the RHS y here because we would lose it's original binding location, so what we have to do is rename the LHS y.

for that we need to make sure the name we're picking isn't causing any problems.

consider we just pick the next letter in the alphabet z.

```
a'': λz. y z
```

this seems fine, when we evaluate this function our semantics remain the same. But imagine that t wasn't just the variable y but a more complicated term.

```
t := λz.λw.z w y w z y
```

well now it's not so simple.

so we need to pick a new name for our binder that does not exist anywhere else. what we need is some fresh name. in our theory we just assume that we just have some mechanism to pick new names but now we're gonna actually implement that.

what information do we need to be able to pick our new name? well let's think about it

λy.λx.λx. x y
because variables always bind closest this is okay it just means that the first x doesn't do anything. it's the same as doing this

```
def function(a, b, some_func):
    return some_func(a)
```

so b is just an unused variable. I didn't explain it very well here and my examples aren't the best, but the point is that because of how shadowing works inside lambda expressions we don't really care if our names on the inside are the same as names on the outside, what we care about is that our outer variables don't accidentally capture names on the inside
