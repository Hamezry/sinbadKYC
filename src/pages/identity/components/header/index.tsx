import { Form, Formik } from "formik";
import { FormInput2 } from "../../../../components/form";

const ClientHeader = () => {
  return (
    <div className=" bg-white rounded-lg md:w-full p-4 flex flex-col gap-4">
      <Formik
        initialValues={{
          first_name: "",
          last_name: "",
          email: "",
          password: "",
        }}
        onSubmit={(values) => {
          const User = {
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            password: values.password,
          };
          alert(User);
        }}
      >
        {({ handleSubmit }) => (
          <Form className=" w-full px-5">
           
            <div className=" flex flex-col gap-4">
            <p className="font-bold text-sinbadKYC-grey border-b border-sinbadKYC-bordergrey p-4">
              Nigeria
            </p>
              {" "}
              <FormInput2
                label="Account Balance (3 Month)"
                id="balance"
                name="balance"
                type="text"
                placeholder="Free text"
              />
              <FormInput2
                label="Employed:"
                id="balance"
                name="yes"
                type="text"
                placeholder="Free text"
              />
              <FormInput2
                label="Monthly Salary (Equal or More than):"
                id="balance"
                name="balance"
                type="text"
                placeholder="Free text"
              />
            </div>

            <div className=" flex flex-col gap-4">
            <p className="font-bold text-sinbadKYC-grey border-b border-sinbadKYC-bordergrey p-4">
              India
            </p>
              {" "}
              <FormInput2
                label="Account Balance (3 Month)"
                id="balance"
                name="balance"
                type="text"
                placeholder="Free text"
              />
              <FormInput2
                label="Employed:"
                id="balance"
                name="balance"
                type="text"
                placeholder="Yes"
              />
              <FormInput2
                label="Salary (Equal or More than):"
                id="balance"
                name="balance"
                type="text"
                placeholder="Free Text"
              />
            </div>

            <div className=" flex flex-col gap-4">
            <p className="font-bold text-sinbadKYC-grey border-b border-sinbadKYC-bordergrey p-4">
            Indonesia 
            </p>
              {" "}
              <FormInput2
                label="Account Balance (3 Month)"
                id="balance"
                name="balance"
                type="text"
                placeholder="Free text"
              />
              <FormInput2
                label="Employed:"
                id="balance"
                name="balance"
                type="text"
                placeholder="Yes"
              />
              <FormInput2
                label="Salary (Equal or More than):"
                id="balance"
                name="balance"
                type="text"
                placeholder="Free Text"
              />
            </div>
          </Form>
     

        )}
      </Formik>
    </div>
  );
};

export default ClientHeader;