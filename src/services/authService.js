import { storageService } from './storageService';

const AUTH_KEY = 'propintel_auth';

export const authService = {
  getAuthUser() {
    try {
      const data = localStorage.getItem(AUTH_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  register() {
    throw new Error('New account creation is disabled in single-user workspace mode.');
  },

  login(email, password) {
    const users = storageService.getUsers();
    
    let user = users.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (!user && users.length === 0) {
      user = {
        id: 'usr_' + Date.now(),
        fullName: email.split('@')[0],
        email: email.trim().toLowerCase(),
        phone: '',
        password: password,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      users.push(user);
      storageService.setUsers(users);
    }

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const authData = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
    return authData;
  },

  logout() {
    localStorage.removeItem(AUTH_KEY);
  },

  updateProfile({ fullName, phone, email }) {
    const current = this.getAuthUser();
    if (!current) throw new Error('Not authenticated');

    const users = storageService.getUsers();
    const idx = users.findIndex(u => u.id === current.id);
    if (idx === -1) {
      const newUser = {
        id: current.id,
        fullName: fullName || current.fullName,
        phone: phone || current.phone,
        email: email || current.email,
        createdAt: current.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      users.push(newUser);
      storageService.setUsers(users);
      localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
      return newUser;
    }

    users[idx] = {
      ...users[idx],
      fullName: fullName ? fullName.trim() : users[idx].fullName,
      phone: phone !== undefined ? phone.trim() : users[idx].phone,
      email: email ? email.trim().toLowerCase() : users[idx].email,
      updatedAt: new Date().toISOString()
    };

    storageService.setUsers(users);
    const updatedAuth = {
      id: users[idx].id,
      fullName: users[idx].fullName,
      email: users[idx].email,
      phone: users[idx].phone,
      createdAt: users[idx].createdAt
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(updatedAuth));
    return updatedAuth;
  },

  changePassword(currentPassword, newPassword) {
    const current = this.getAuthUser();
    if (!current) throw new Error('Not authenticated');

    const users = storageService.getUsers();
    const user = users.find(u => u.id === current.id);
    if (!user || user.password !== currentPassword) {
      throw new Error('Incorrect current password.');
    }

    user.password = newPassword;
    user.updatedAt = new Date().toISOString();
    storageService.setUsers(users);
    return true;
  }
};