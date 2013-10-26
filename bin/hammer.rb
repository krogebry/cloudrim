#!/usr/bin/env ruby_noexec_wrapper
##
#
#
require "rubygems"
require "uuid"
require "mongo"

DBHostname = "cloudrim9-ElasticL-1P1XFT2W121SR-1859032106.us-east-1.elb.amazonaws.com"
DBPort = 27017

u = UUID.new

mc = mongo_client = Mongo::MongoClient.new( DBHostname, DBPort,:pool_size => 15, :pool_timeout => 5 )
coll = mc[ "cloudrim" ]

threads = []

15.times do 
  threads << Thread.new do
    1000.times do 
      coll["users"].insert({
        :name => "Blah%s" % u.generate
      })
    end
  end
end

threads.each{|t| t.join }
