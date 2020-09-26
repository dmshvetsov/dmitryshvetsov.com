---
title: "How to use Webpacker with npm instead of Yarn, Rails guide"
slug: "how-to-use-webpacker-with-npm-instead-of-yarn-rails-guide"
author: "Dmitry Shvetsov"
date: "2018-03-26"
hero: images/hero.png
---

## This article will guide you how to replace Yarn with npm for Webpacker gem

[Webpacker](https://github.com/rails/webpacker) is an awesome tool and giant step towards front-end friendly development environment in Rails. But Webpacker requires installing Yarn. But what if want to use npm?

This article will guide you how to replace Yarn with npm for Webpacker gem.

## Preparation

If you starting a brand new Rails app include `--skip-yarn` option.

If you starting a brand new Rails app include `--skip-yarn` option.

```
$ rails new try_webpacker_with_npm_app --webpack --skip-yarn
```

Even with `--skip-yarn` flag enabled `rails new` command will try to install npm packages via Yarn. If you have Yarn installed then you need to execute the steps below to remove webpacker installation via Yarm. Otherwise, you will be warned with `Yarn not installed…` and no more actions are required.

If you already started to use webpacker with Yarn you have to find and delete `yarn.lock` file and previously installed node modules.

```
$ rm yarn.lock
$ rm -rf node_modules
```

You can remove `bin/yarn` file as well.

**Please note that you have to use webpacker 3.4.1 or greater and Ruby on Rails 5.1 and greater.**

## Replacement

First, you need to disable Webpacker and Yarn integrity check. Add the line below to development and production environment configuration files.

```
config.webpacker.check_yarn_integrity = false
```

The second step is to remove all rake tasks related to Yarn and define new npm tasks in Rakefile after `Rails.application.load_tasks` line.

The last part. New npm tasks will be in `lib/tasks/webpacker.rake` file. `webpacker:check_npm` and `webpacker:npm_install` will be doing the same job as removed `webpacker:yarn_install` and `webpacker:check_yarn tasks`.

The whole solution is listed below:

```
# config/environments/development.rb

Rails.application.configure do
  config.webpacker.check_yarn_integrity = false
  
  # the rest of the file is omitted
```

```
# config/environments/production.rb

Rails.application.configure do
  config.webpacker.check_yarn_integrity = false
  
  # the rest of the file is omitted
```

```
# Rakefile

require File.expand_path('../config/application', __FILE__)

Rails.application.load_tasks

# Replace yarn with npm
Rake::Task['yarn:install'].clear if Rake::Task.task_defined?('yarn:install')
Rake::Task['webpacker:yarn_install'].clear
Rake::Task['webpacker:check_yarn'].clear
Rake::Task.define_task('webpacker:verify_install' => ['webpacker:check_npm'])
Rake::Task.define_task('webpacker:compile' => ['webpacker:npm_install'])
```

```
# lib/tasks/webpacker.rake

namespace :webpacker do
  task :check_npm do
    begin
      npm_version = `npm --version`
      raise Errno::ENOENT if npm_version.blank?
      version = Gem::Version.new(npm_version)

      package_json_path = Pathname.new("#{Rails.root}/package.json").realpath
      npm_requirement = JSON.parse(package_json_path.read).dig('engines', 'npm')
      requirement = Gem::Requirement.new(npm_requirement)

      unless requirement.satisfied_by?(version)
        $stderr.puts "Webpacker requires npm #{requirement} and you are using #{version}" && exit!
      end
    rescue Errno::ENOENT
      $stderr.puts 'npm not installed'
      $stderr.puts 'Install NPM https://www.npmjs.com/get-npm' && exit!
    end
  end

  task :npm_install do
    system 'npm install'
  end
end
```
