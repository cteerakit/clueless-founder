---
title: "I built a job board using no-code tools"
description: "I built a working job board prototype with no-code tools, sharing what worked across frontend and backend, where limits appeared, and what I would change next."
excerpt: "I built a working job board prototype with no-code tools, sharing what worked across frontend and backend, where limits appeared, and what I would change next."
coverImage: "/images/posts/i-built-a-job-board-using-no-code-tools/cover-7e2d460a5f.webp"
pubDate: 2024-02-05
category: "Notes"
newsletter: true
draft: false
---

When I was a kid, I always dreamed of building software that a lot of people enjoy using. I still do today. There is one problem, I don’t know how to code. And learning to code today takes time as modern software development becomes more complex.

Back then when I was in high school, there was a computer class that taught basic web development. HTML and CSS (or Flash 😆) are enough to build a website. Now we have JavaScript, PHP, TypeScript, and a bunch of frameworks. Because of this No-code and Low-code tools (platforms that help you develop software with minimal or no coding) were born.

So instead of learning to code and create stuff from scratch, or hiring a developer, let’s try to find existing no-code tools that do the things we need and glue them together. It is 2024 and it has never been easier to build software.

## Let’s build

I will create a prototype for [Telepath](https://telepath.work/), a job board for remote companies. I just want to see if the tools available today are good enough to build a simple product. You may learn why in my [previous blog post](http://previous%20blog%20post/).

There are 3 main things I need to build.

### 1. Front-end for job seekers

The first thing is to develop a place to list jobs. Since we’re building a directory, there are a few tools I considered:

**Web builders** like [Webflow](https://webflow.com/) and [Framer](https://www.framer.com/). They’re great at building websites. They have their own built-in CMS which is an upside for building a website but a downside for the two-sided marketplace. This is because we need the same data to be read and written by another platform (recruiter’s platform). So it’s a no-go.

**Web app builders** like [Bubble](https://bubble.io/) and [WeWeb](https://www.weweb.io/). They are the most flexible platforms to build pretty much anything. The learning curve is steep so not for now.

**Job board software** like [Niceboard](https://niceboard.co/), [Jboard](https://jboard.io/), and [JobBoard.io](https://JobBoard.io). They are built specifically for job boards with all the functionality a job board needs. This seems to be the best way at first. But one big downside is the product will lack a competitive edge as anyone can build the same product using the same tools you do. So as a proof of concept, it is fine. But not great for the long term.

**Other no-code development platforms** like [Softr](https://www.softr.io/), [Glide](https://www.glideapps.com/), and [Pory](https://pory.io/). These tools are built to create custom web apps that connect with external databases. This is a good option.

As I will be building a prototype, plus my inability to code, and laziness in design, but still want some customizability. I chose [Pory](https://pory.io/) as a tool to develop this prototype.

Building a directory with Pory is easy, and free to get started. It connects with Airtable natively. In only a few hours, I created a functional job board. ([https://telepath.pory.app/](https://telepath.pory.app/))

![](/images/posts/i-built-a-job-board-using-no-code-tools/inline-01-cb77627b4b.webp)

After playing around with it, I found a few problems that come with Pory.

1. **Limited functionality** — Pory is built for one specific purpose, to display Airtable data beautifully. While it has done a great job, it lacks other functions that I need for the product.
2. **Bugs** — There are so many bugs I found. I spent only a few hours and I already found so many things that were not working as intended.
3. **Support** — They have a support channel in Slack. While they are quick to respond, it has been 2 months since I posted, and that one bug hasn’t been fixed.

The platform is new with a small team and I completely understand that. Telepath will likely be the same for a while.

My take is Pory is a great tool if you are looking to build a simple portal. But at this stage, I cannot recommend building a real product using it yet. Because of this, I will need to find a new way to build the front end for job seekers. (I ended up moving to [WeWeb](https://dashboard.weweb.io/sign-up/25c5c028-6236-4447-83c9-3a5bdc315c84))

### 2. Front-end for recruiters

This part is unnecessary early as you can replace it with a simple Google Form. However, I want to encourage one recruiter to post multiple jobs. If we use a form, the recruiter will need to copy and paste company information multiple times repeatedly. It will also be impossible for a recruiter to manage the existing job posts.

For those reasons, I built the platform using [Glide](https://www.glideapps.com/) as a tool for recruiter to manage their job posts. Glide is perfect for this case. It is easy to build, connects with Airtable, beautifully designed. One downside is the platform you build will not get indexed, which is fine for this use case. ([https://telepath-recruiter.glide.page/](https://telepath-recruiter.glide.page/))

![](/images/posts/i-built-a-job-board-using-no-code-tools/inline-02-260fb4adf4.webp)

The experience is great so far. I will probably use this for a while until the product needs more complex features.

### 3. Back-end for database

I use [Airtable](https://airtable.com/) as a central database to collect job posts as both of the previous tools connect to it. The database will be small for a while, so I don’t need to worry too much about this.

![](/images/posts/i-built-a-job-board-using-no-code-tools/inline-03-f590478e38.webp)

However, in the far future, I will eventually run into limitations and need to migrate to a production-grade backend system like Firebase, Supabase, or Xano as it will need to cover other stuff like authentication, and security. Luckily, Glide will connect to those as well. But for now, it will do just fine.

### Next steps

At this point, Recruiters can register and create job posts. Job seekers can apply for jobs. But it’s only a link to the brand’s career page or email. While the platform is functional, it is nowhere near a good product yet. Nonetheless, I have spent $0 so far.

To sum up, this proves that building a decent software product with no-code tools is possible. And I am very excited to push this limit further.

My next step is to rebuild the front end for job seekers using other approaches. So I will explore other web app development tools that serve my specific criteria. Check out the current website at [telepath.work](https://telepath.work).

If you are interested in what I do, please join my [Discord channel](https://discord.gg/6sBU7pyQUZ). Whether you are currently working remotely, looking for remote job opportunities, or hiring fully remote/hybrid positions, you are welcome.
