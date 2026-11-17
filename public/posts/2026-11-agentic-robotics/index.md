---
title: "Agents in robotics: learning to program the physical world"
date: "2026-11-17"
tags: [robotics, agents, simulation]
summary: AI agents may help robots escape the trade-off between hand-engineered control and data-hungry learning.
---

For years, robot programming has largely followed one of two paths. In
**model-based robotics**, engineers explicitly specify how a robot should
perceive a scene, plan a motion, and control its actuators. In **model-free
robotics**, the robot instead learns from demonstrations or experience. The
first path is interpretable but labor-intensive; the second is flexible but
needs a great deal of data. Neither scales easily to the long tail of
real-world tasks.

Recent work from UC Berkeley and NVIDIA proposes a third route:
**agentic robotics**. Rather than asking an AI agent to control every motor
command directly, the approach asks agents to write, test, and revise the
robot's program.

## The robot as a program, not a single policy

The central idea is to break a task into reusable skills. A pick-and-place
operation, for example, might contain separate skills for locating an object,
selecting a grasp, moving the gripper, and avoiding collisions. Under a
framework called **Graph-as-Policy**, these skills become nodes in a graph; an
agent decides how to connect them into a complete program.

This separation matters. The language model is not expected to possess perfect
physical intuition. It is expected to reason about code, use simulation tools,
and iterate when the simulated robot fails.

## Closing the loop in simulation

The workflow resembles modern software development more than classical control
engineering:

1. An agent generates a candidate robot program from a task description.
2. The program runs in simulation across variations in objects, positions, and
   physics.
3. The agent inspects failures, revises the program or the simulation, and
   tests again.
4. A human engineer reviews the result before deployment.

Simulation supplies something that language data cannot: an inexpensive place
to make mistakes. In one reported experiment, a real robot produced a video of
a failed attempt. An AI model used that evidence to improve the simulation and
the control program; after another round of testing, the revised program
worked on the physical robot.

The agent is therefore not replacing physics or control theory. It is acting as
an engineer's assistant inside a closed loop of **generate, simulate, evaluate,
and refine**.

## Why this could matter outside the lab

Industrial environments are a natural early fit because their tasks are
repetitive, measurable, and already instrumented. Berkeley-based Ambi Robotics
reported applying the approach to parcel-sorting data, increasing capacity by
more than 15,000 packages per robot per year and deploying the update across
30% of its U.S. fleet.

That is a useful reminder that "agentic" does not have to mean an autonomous
humanoid wandering through a house. A simpler and more plausible near-term
pattern is an agent that improves the software behind a specialized machine,
with engineers retaining oversight.

## The hard parts remain

Agentic robotics is promising, but it is not a shortcut around embodiment.
Simulation can be wrong, video can be ambiguous, and a program that succeeds
across many trials can still fail at the boundary of its training distribution.
Verification, safety constraints, and human approval are therefore essential,
especially as these methods move into shared physical spaces.

The broader significance is the change in abstraction level. Instead of
hand-tuning every behavior, engineers may increasingly design the tools,
simulation environments, benchmarks, and guardrails within which agents
generate and improve robot programs. If that workflow proves reliable, the
bottleneck in robotics shifts from writing code to specifying what should be
true—and proving that it is.

Source: [Berkeley News, "Recent advances in AI are creating a paradigm shift
for robotics"](https://news.berkeley.edu/2026/11/09/recent-advances-in-ai-are-creating-a-paradigm-shift-for-robotics/).
