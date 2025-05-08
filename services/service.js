const { supabase } = require('../utils/supabase');

class Service {
  constructor(req) {
    this.supabase = supabase(req);
  }
}

module.exports = Service;
