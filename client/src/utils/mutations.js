import { gql } from '@apollo/client';

// Login Mutation
export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

// Add User Mutation
export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        bookCount
        savedBooks {
          authors
          bookId
          image
          link
          title
          description
        }
      }
    }
  }
`;

// Save Book Mutation
export const SAVE_BOOK = gql`
  mutation saveBook(
    $authors: [String]!,
    $description: String,
    $bookId: String!,
    $image: String!,
    $title: String!
  ) {
    saveBook(
      authors: $authors,
      description: $description,
      bookId: $bookId,
      image: $image,
      title: $title
    ) {
      username
      bookCount
    }
  }
`;

// Remove Book Mutation
export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: String!) {
    removeBook(bookId: $bookId) {
      savedBooks {
        authors
        description
        bookId
        image
        title
      }
    }
  }
`;