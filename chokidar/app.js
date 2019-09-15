const chokidar = require('chokidar');

// One-liner for current directory, ignores .dotfiles
var watcher = chokidar.watch('./data/',{ignored: /[\/\\]\./});

watcher.on('ready', function(){
  console.log('---watching')

  watcher.on('add', function(path){
    console.log(path)
  })

  watcher.on('change', function(path){
    console.log(path)
  })
})
