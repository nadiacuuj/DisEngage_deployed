import OrganizationPage from "../component/OrganizationPage";

function OrganizationListPage () {

let organization = {
        title: "Product Management Club",
        logo: "https://se-images.campuslabs.com/clink/images/4b100d87-58fd-4a2f-8a60-c334a1bf372aa31e4163-a160-4bfb-97a0-96d04cdb5126.jpg?preset=med-sq",
        description: "The Product Management Club will build a community at NYU by connecting students interested in design, business, and engineering with resources, mentorship, and workshops so they can tackle diverse problems faced by businesses and consumers. Our club encourages curiosity and teamwork as we inspire students to build exciting products and explore PM in various industries.",
        contact: "pmc@nyu.edu",
};
  return(
    <OrganizationPage organization={organization}/>
  )
        
}

export default OrganizationListPage;