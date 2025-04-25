import bcrypt from 'bcrypt';

const isValid = await bcrypt.compare("31Goodness10", "$2b$10$Re9Ei7yFB/kgo17h7HFh2eHd3ayvLfJnk.7R8Oqoi1ptXeui6fUce");
console.log("Valid password?", isValid);