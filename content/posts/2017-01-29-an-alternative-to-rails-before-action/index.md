---
title: "An alternative to Rails `before_action`"
slug: "an-alternative-to-rails-before-action"
author: "Dmitry Shvetsov"
date: "2017-01-29"
hero: images/hero.png
---

> Rails \`before\_action\` is a good tool but often used incorrectly. In this article, I will show what is wrong and my remedy for \`before\_action\` abuse.

Let's assume that we have a task.

There is a Ruby on Rails project. The task is to determine whether a page visitor has access to a controller method before the method execution. The ideal task for a controller filter, now called `before_action` in Rails. But I need the data from the filter in the controller method itself. I do not want to make a second request for the same data again. I do not want to clutter up the session and do not want to assign an instance variable in the controller filter.

With the constraint above I produced the solution below:

```ruby
# Models: User, CustomerSpecialOffer, SpecialOffer
#
# User has_many CustomerSpecialOffer as customer
# CustomerSpecialOffer belongs_to customer
# CustomerSpecialOffer belongs_to SpecialOffer
# SpecialOffer has_many CustomerSpecialOffer
#
className SpecialOfferController < ApplicationController
  def show
    customer_special_offer_code do |offer_code|
      special_offer = SpecialOffer.find(params[:id])
      render 'show', locals: { special_offer: special_offer, offer_code: offer_code }
    end
  end
  
  def no_offers
  end

  private

  def customer_special_offer_code
    offer_code = CustomerSpecialOffer
      .where(special_offer_id: params[:id], customer: current_user)
      .select(:offer_code)
      .first

    if offer_code
      yield(offer_code)
    else
      redirect_to 'no_offers'
    end
  end
end
```

The `#customer_special_offer_code` block acts as a filter and at the same time as a source of the required data `offer_code`.

I did a check, acquire the data, set no instance variables in the controller scope and have no extra database queries. Job done!

* * *

Very often the `before_action` method is used so that it only harms the code. For example, [this “Best practice”](https://rails-bestpractices.com/posts/2010/07/24/use-before_filter/) is wrong in my opinion in two reasons:

- the code has become harder to understand, you should look for more than one place to understand what’s going on
- controller inheritance is no longer an option, together with inherited methods, you will get all filters; although I do not recommend to consider inheritance with any resource controllers, ApplicationController, AdminController, and similar controllers are the exception.

Following the statements above, I do not recommend to do this:

```ruby
className UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update]
  
  def show
  end
  
  def edit
  end
  
  def update
    if @user.update(user_params)
      redirect_to @user, notice: 'User was successfully updated.'
    else
      render :edit
    end
  end
  
  private
  
  def set_user
    @user = User.find(params[:id])
  end
  
  def user_params
    params.require(:user).permit(:name, :email, :password,
                                 :password_confirmation)
  end
end
```

As an alternative, I suggest using a block with an explicit returned value. Here is what I mean:

```ruby
className UsersController < ApplicationController
  def show
    find_user do |user|
      render :show, locals: { user: user }
    end
  end

  def edit
    find_user do |user|
      render :edit, locals: { user: user }
    end
  end
  
  def update
    find_user do |user|
      if user.update(user_params)
        redirect_to user, notice: 'User was successfully updated.'
      else
        render :edit, locals: { user: user }
      end
    emd
  end
  
  private
  
  def find_user
    user = User.find(params[:id])
    yield(user)
  end

  def user_params
    params.require(:user).permit(:name, :email, :password,
                                 :password_confirmation)
  end
end
```

In my opinion, the block method more clean and simple solution for the data instantiation problem rather than `before_action` approach.

* * *

If you have opinion, suggestions, feedback on this topic please drop a comment. I will be happy to have a talk about it.

## Related materials

- [Article: Don't use before action to load data](http://craftingruby.com/posts/2015/05/31/dont-use-before-action-to-load-data.html)
- [Video: Encapsulation and Global State in Rails](https://thoughtbot.com/upcase/videos/encapsulation-and-global-state-in-rails)
