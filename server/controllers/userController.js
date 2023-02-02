const User = require('../../models/user.js');

// View all users
exports.view = (req, res) => {
  User.fetchAll(rows => {
    let removedUser = req.query.removed;
    res.render('home', { rows, removedUser });
  });
}

// Find user by comparing search term with his name
exports.find = (req, res) => {
  let searchTerm = req.body.search;
  User.searchByName(searchTerm, rows => {
    res.render('home', { rows });
  });
};

exports.form = (req, res) => {
  res.render('add-user', {user : new User(0, "","","","","")});
}

// Add new user
exports.create = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;
  const user = new User(-1, first_name, last_name, email, phone, comments);

  user.save(rows => {
    res.render('add-user', {alert: 'User added successfully.', user : user});
  });
};

// Edit user
exports.edit = (req, res) => {
  const user = User.findById(req.params.id, rows => {
    res.render('edit-user', { rows });
  });
}

// Update user
exports.update = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;

  let user = new User(req.params.id, first_name, last_name, email, phone, comments);
  user.update(rows => {
    User.findById(req.params.id, result => {
      res.render('edit-user', { result, alert: `${first_name} has been updated.` });
    });
  });
}

// Delete user, by deactivating him
exports.delete = (req, res) => {
  User.setStatus(req.params.id, 'deleted', rows => {
    let removedUser = encodeURIComponent('User successfully removed.');
    res.redirect('/?removed=' + removedUser);
  });
}

// Activate user, setting status to activated
exports.activate = (req, res) => {
  User.setStatus(req.params.id, 'active', rows => {
    let user = encodeURIComponent('User successfully activated.');
    res.redirect('/?active=' + user);
  });
}

// Deactivate user, i.e. set his status to none again
exports.deactivate = (req, res) => {
  User.setStatus(req.params.id, 'none', rows => {
    let user = encodeURIComponent('User successfully deactivated.');
    res.redirect('/?deactivated=' + user);
  });
}

// View the user with an id
exports.viewall = (req, res) => {
  User.findById(req.params.id, rows => {
    res.render('view-user', { rows });
  });
}