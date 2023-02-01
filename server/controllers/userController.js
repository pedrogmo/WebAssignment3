const User = require('../../models/user.js');

// View all users
exports.view = (req, res) => {
  User.fetchAllActive(rows => {
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
  res.render('add-user');
}

// Add new user
exports.create = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;
  const user = new User(-1, first_name, last_name, email, phone, comments);

  user.save(rows => {
    res.render('add-user', { alert: 'User added successfully.' });
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
    User.findById(req.params.id, callback => {
      res.render('edit-user', { result, alert: `${first_name} has been updated.` });
    });
  });
}

// Delete user, by deactivating him
exports.delete = (req, res) => {
  User.deactivate(req.params.id, rows => {
    let removedUser = encodeURIComponent('User successeflly removed.');
    res.redirect('/?removed=' + removedUser);
  });
}

// View the user with an id
exports.viewall = (req, res) => {
  User.findById(req.params.id, rows => {
    res.render('view-user', { rows });
  });
}