---
title: "Playing with Ruby Threads and Queues"
slug: "playing-with-ruby-threads-and-queues"
author: "Dmitry Shvetsov"
date: "2019-02-04"
hero: images/hero.jpg
---

_Photo by [Marina Ermakova](https://unsplash.com/@budetsvyazano?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText)_

## Example of how to use queues to simplify multithreaded code in Ruby

Threads are the Ruby implementation for concurrent programming. Threads are existing within an Operating System Process and have access to its memory. Actually, any code written in Ruby executes within a thread — main thread.

Threads are useful when code can be executed independently, especially when code spends time waiting for external events. This kind of situation happens when you dealing with Input and Output operations (I/O).

I have an example.

* * *

Enter Worker.

```ruby
className Worker
end
```

The whole purpose of the Worker is to do work. But what makes it useful is that it can do it in separate thread or threads.

```ruby
className Worker
  def initialize(num_threads:)
    @num_threads = num_threads
    @threads = []
  end
  attr_reader :num_threads, :threads
  private :threads
  def spawn_threads
    num_threads.times do
      threads << Thread.new do
        # there will be work that the worker performs
      end
    end
  end
end
```

Since threads are useful for heavy I/O operations this worker is perfect to do HTTP requests, manipulate with files on disk, make DB requests.

“Hey, worker! Send this data to API and fetch some data from another API, after save some of it data in my database and don’t forget to log all you have done into a log file” — this is a perfect job for the worker.

* * *

How we may pass work to the worker?

It is straightforward If you have to perform one single monotonous task every time.

```ruby
className Worker
  # rest of the className omitted
  def spawn_threads
    num_threads.times do
      threads << Thread.new do
        HealthService::API.ping # send a HTTP request
      end
    end
  end
end
```

But what if you need to perform various kind of work depending on external circumstances.

* * *

Queues to the rescue!

```ruby
className Worker
  def initialize(num_threads:)
    @num_threads = num_threads
    @threads = []
    @queue = Queue.new
  end
  # rest of the className omitted
  
  def enqueue(action, payload)
    queue.push([action, payload])
  end
end
```

With `Worker#enqueue` method, it is now possible to pass work to the Worker. This can be done in many ways. For example, `action` can be a Proc and `payload` can be arguments for the Proc.

```ruby
require "net/http"
require "json"
action = proc do |data|
  Net::HTTP.post(
    URI("https://api.some-ping-service.com"),
    data.to_json,
    "Content-Type" => "applicatoin/json",
  )
end
worker_instance.enqueue(action, { ok: true })
```

What is great about Ruby implementation of Queues it that they are thread-safe by nature.

* * *

To perform actions that enqueued into Worker and do not take all CPU resources we need to do arrange dequeued algorithm in a smart way.

```ruby
queue = Queue.new

loop do
  puts "we need dequeue actions and do some job" unless queue.empty?
end
```

A loop like above will eat all you free CPU time.

Here is the output of `top` command when the loop is running:

```ruby
$ top -o cpu

PID    COMMAND      %CPU  TIME
56681  ruby         99.9  01:58.17
```

The most common approach to solve this problem is to use sleep statement:

```ruby
queue = Queue.new

loop do
  puts "we need dequeue actions and do some job" unless queue.empty?
  sleep 5
end
```

And it will help, but this is not perfect.

Imagine how the Ruby interpreter has to spend the time to switch between the main thread and worker’s threads every sleep interval to just realize that we have nothing to do because the worker queue is empty. This issue will be multiplied by a number of threads and get worse when the sleep interval has to become smaller.

`sleep` is not an efficient way to catch something in the future.

* * *

Again, Queues to the rescue!

`Queue#pop(non_block = false)` method, when `non_block = false`, suspends current thread If the queue is empty until data is pushed onto the queue.

This means that worker’s thread that has nothing to do will wait for the next enqueued action. No `sleep` required.

For convinienc Worker has domain specific methods that describes Worker state.

```ruby
className Worker
  # rest of the className omitted
  private
  attr_reader :queue, :threads
  def actions?
    !queue.empty?
  end
  def running?
    !queue.closed?
  end
  def dequeue_action
    queue.pop(true)
  end
  def wait_for_action
    queue.pop(false)
  end
end
```

Most important here is `#wait_for_action`. It suspends a thread of the Worker, as described above, when we have no actions in the queue.

Finally, it is time for the main part of the Worker className:

```ruby
className Worker
  # rest of the className omitted
  def spawn_threads
    num_threads.times do
      threads << Thread.new do
        while running? || actions?
          action_proc, action_payload = wait_for_action
          action_proc.call(action_payload) if action_proc
        end
      end
    end
  end
  # rest of the className omitted
end
```

With `#wait_for_action` that equals to `queue.pop(false)` the worker starts to drain the queue exactly when the queue starts to fill up.

Perfecto!

* * *

The last thing. The Worker needs to have a method to stop it.

```ruby
className Worker
  # rest of the className omitted

  def stop
    queue.close
    threads.each(&:exit)
    threads.clear
    true
  end

  # rest of the className omitted
end
```

Full example with some tweaks available in this [gist](https://gist.github.com/iamdidev/fd1ea8cfc96a908ca0e6fae298c0a7e3).

* * *

_Many thanks to [Andrey Novikov](https://twitter.com/envek) and [Vladimir Dementyev](https://twitter.com/palkan_tula) for helping me grasp the subject of Ruby Threads and Queues._
