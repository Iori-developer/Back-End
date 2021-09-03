const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission');
  }
  const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      console.log('1')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          })
          console.log('2')
          .then(user => {
            res.json(user[0]);
          })
      })
      console.log('3')
      .then(trx.commit)
      .catch(trx.rollback)
      console.log('4')
    })
    console.log('5')
    .catch(err => res.status(400).json('4'))
}

module.exports = {
  handleRegister: handleRegister
};