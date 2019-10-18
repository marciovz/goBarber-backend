import User from '../models/User';

class UserController {
  async store(req, res) {
    const userExistes = await User.findOne({
      where: { email: req.body.email },
    });

    if (userExistes) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const { id, name, email, provider } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    // Verifica se o novo email já existe
    if (email !== user.email) {
      const userExistes = await User.findOne({ where: { email } });
      if (userExistes) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    // Verifica se veio o oldPassword na requisição, e se ela é valida permite update
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      provider,
    });
  }
}

export default new UserController();
