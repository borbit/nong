Vagrant::Config.run do |config|
  config.vm.box = "lucid32"

  config.vm.forward_port("web", 80, 8000)
  config.vm.forward_port("ws", 8080, 8080)
  config.vm.share_folder("v-root", "/opt/nong", ".")

  config.vm.provision :chef_solo do |chef|
    chef.cookbooks_path = [
      "chef/opscode-cookbooks",
      "chef/mdxp-cookbooks"
    ]

    chef.add_recipe "java"
    chef.add_recipe "ant"

    chef.add_recipe "nodejs"
    chef.add_recipe "nodejs::npm"

    chef.add_recipe "nginx::default"

    chef.json.merge!({
      :java => {
        :install_flavor => "sun"
      },
      :nodejs => {
        :version => "0.4.1",
        :npm => "0.3.0-10"
      }
    })
  end
end
