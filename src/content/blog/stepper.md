---
title: Building a λ-calculus stepper
date: 2026-02-04
draft: true
---

take some term to some other term

we have 3 types of terms 

1. Variables
2. Lambda expressions
3. Function application

a stepper is a function that takes one term and performs one reduction step. Variables (1) and Lambda Terms (2) can't be reduced further. The only type of term that can be reduced is a function application term.

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
