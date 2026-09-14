---
title: Notes from a Flood Plain
date: '2025-05-22'
summary: >-
  Six days with the engineers who manage a river that has already decided what
  it is going to do. Includes the rainfall table they use, which is less
  reassuring than you would hope.
tags:
  - Field Notes
  - Infrastructure
---

The control room is on the second floor of a building that has been flooded twice. Both times were in the last decade. Nobody I met there found this funny, and I made the mistake of finding it funny on the first morning.

## The problem, in one paragraph

The river has a hundred-year flood level, which is the level it is expected to reach once a century. In the last twenty-five years it has reached that level four times. The engineers do not describe this as a hundred-year flood level any more. They describe it as *the line on the wall*, and they point at it, and then they look at you to see whether you have understood.

I understood on the third day.

## What they actually do

Most of the work is not flood defence. It is **argument**, conducted in rooms, on a timescale of years, against a budget cycle of one year.

- They measure. Constantly, and mostly manually, because the automated gauges keep being destroyed.
- They model. A hydraulic model of the catchment runs on a workstation under a desk, and it is, by the admission of the person who maintains it, held together with tape.
- They negotiate. A flood defence upstream is a flood somewhere downstream, and the somewhere downstream has a council and a lawyer.
- They wait. The waiting is the bulk of it.

### The gauge readings

Six days of manual readings from the upper station, which is the number that actually drives the operational decision:

| Day | Rainfall (mm) | River level (m) | Gate setting |
| --- | ---: | ---: | :-- |
| Mon | 4.2  | 1.18 | Open |
| Tue | 19.6 | 1.44 | Open |
| Wed | 41.0 | 2.31 | Half |
| Thu | 52.8 | 3.02 | **Half, monitoring** |
| Fri | 12.4 | 3.55 | Half |
| Sat | 0.0  | 3.61 | Closing |

The thing that jumps out is Saturday. No rain at all, and the river still rising — because the water that fell on Wednesday had only just arrived. Everything about this work happens on a delay of between one and three days, which is roughly the same delay as the political attention span.

> The water does not care which budget year it is. That is the whole problem, and it is why we lose.

## The script under the desk

The model is driven by a script that a retired engineer wrote in 2009 and that nobody has fully read since. It is 1,400 lines long. It works, in the sense that the numbers it produces match the river. It is not documented.

```python
# WARNING: do not change the 0.87 below.
# It is not a calibration constant. It is fudge.
# Tested against 2004-2011 gauges. Changing it
# breaks 2013. Nobody knows why. Ask Elif.
stage = inflow_m3s * 0.87 / channel_width
```

I asked four people about the 0.87. Three of them laughed. The fourth, who is the only person who can modify the file without breaking it, said: "It is not fudge. It is the shape of the channel, expressed as a number by somebody who could not be bothered to explain himself."

That is the most honest sentence about infrastructure I have ever been told.

## What I took away

Since that week I have stopped thinking of infrastructure as things — gates, walls, pumps. It is a **standing argument** that a group of specific people are having, continuously, with a river that is not listening and a budget that resets every year.

The argument is currently being won on technical merit and lost on timescale. I have no idea what happens next. Neither, it turns out, do they — which is the part I could not put in the piece I filed, and the part I have been thinking about since.
