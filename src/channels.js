module.exports = function(app) {
  if(typeof app.channel !== 'function') {
    return;
  }

  app.on('connection', connection => {
    app.channel('everybody').join(connection);
  });

  app.publish(() => app.channel('everybody'));
};
