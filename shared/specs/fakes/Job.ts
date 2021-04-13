import casual from "casual";

export const makeJobForm = () => ({
  title: casual.title,
  description: casual.description,
  skills: casual.array_of_words(7),
  location: casual.city,
});
