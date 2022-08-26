const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
              return User
                .findOne({ _id: context.user._id })
                .populate('savedBooks');
            }
            throw new AuthenticationError('You need to be logged in!');
        },
    },
    Mutation: {
        //Create user
        addUser: async (parent, {username, email, password}, context) => {
            console.log("USER FROM CONTEXT", context)
            const user = await User.create({username, email, password});
            console.log(user)
            if (!user) {
                return res.status(400).json({ message: 'Something is wrong!' });
            }
            const token = signToken(user);

            return { token, user }
        },
        
        login: async (parent, {email, password}) => {
            const user = await User.findOne({ email });

            if (!user) {
              throw new AuthenticationError('No user found with this email address!');
            }

            const correctPw = await user.isCorrectPassword(password);
      
            if (!correctPw) {
              throw new AuthenticationError('Incorrect credentials');
            }
      
            const token = signToken(user);
      
            return { token, user };
        },
        
        saveBook: async (parent, { book }, context) => {
            try {
                // if (!context.user) throw new AuthenticationError('You need to be logged in!');

                const  savedBooks  = await User.findOneAndUpdate(
                    { _id: context.data._id },
                    { $addToSet: { savedBooks: book } },
                    { new: true}
                );
                return savedBooks;
            } catch (err) {
                console.log(err);
                return err;
            }
        },

        removeBook: async (parent, { bookId }, context) => {
            try {
                if (!context.user) throw new AuthenticationError('You need to be logged in!');

                const updatedUser = await User.findOneAndUpdate(
                  { _id: context.user._id },
                  { $pull: { savedBooks: { bookId: bookId } } },
                  { new: true }
                );
                if (!updatedUser) {
                  return { message: "Couldn't find user with this id!" }
                }
                return updatedUser
            } catch(err) { 
                console.log(err)
                return err
            }
        },
    } 
 }
  


module.exports = resolvers;