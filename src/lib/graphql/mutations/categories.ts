import { gql } from "graphql-tag";

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($name: String!, $image: String!, $video: String!) {
    createCategory(name: $name, image: $image, video: $video) {
      id
      name
      image
      video
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: ID!, $name: String, $image: String, $video: String) {
    updateCategory(id: $id, name: $name, image: $image, video: $video) {
      id
      name
      image
      video
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`;