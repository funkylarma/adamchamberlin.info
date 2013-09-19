require 'bundler'
require 'rack/jekyll'
require 'newrelic_rpm'

Bundler.require(:default, :production)
NewRelic::Agent.after_fork(:force_reconnect => true)

use Rack::Deflater
Bundler.require(:default)

run Rack::Jekyll.new