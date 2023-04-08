import {
  Button,
  Form,
  Input,
  message,
  Select,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { BiChevronDown } from "react-icons/bi";
import TooltipInputField from "../components/tooltipInputField/tooltipInputField";
import { STRINGS } from "../utils/constants/strings";
import { FiDelete } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { IoCloseCircle, IoCloseCircleOutline } from "react-icons/io5";
import { ModelViewer } from "../components/model-viewer";

const { Option } = Select;
const { Dragger } = Upload;

const currencyOptions = [
  { value: "USD", label: STRINGS.USD },
  { value: "EUR", label: STRINGS.EUR },
  { value: "INR", label: STRINGS.INR },
];

const categories = [
  "Animals & Pets",
  "Architecture",
  "Art & Abstract",
  "Cars & Vehicles",
  "Characters & Creatures",
  "Cultural Heritage & History",
  "Electronics & Gadgets",
  "Fashion & Style",
  "Food & Drink",
  "Furniture & Home",
  "Music",
  "Nature & Plants",
  "News & Politics",
  "People",
  "Places & Travel",
  "Science & Technology",
  "Sports & Fitness",
  "Weapons & Military",
];

const supportedExtensions = [
  "sap",
  "max",
  "fbx",
  "obj",
  "stl",
  "x3d",
  "dae",
  "vrml",
  "3ds",
  "3mf",
];

export const AssetUploadPage = () => {
  const { values, errors, handleSubmit, handleChange, setFieldValue } =
    useFormik({
      initialValues: {
        name: "",
        description: "",
        price: 0,
        currency: "USD",
        tags: [],
        modelFiles: [],
      },
      validateOnChange: false,
      validateOnBlur: false,
      validationSchema: Yup.object().shape({
        name: Yup.string().required(STRINGS.REQUIRED_NAME),
        description: Yup.string().required(STRINGS.REQUIRED_DESCRIPTION),
        price: Yup.number().required(STRINGS.REQUIRED_PRICE),
        currency: Yup.string().required(STRINGS.REQUIRED_CURRENCY),
        tags: Yup.array().required(STRINGS.REQUIRED_TAGS),
      }),
      onSubmit: (values, formikHelpers) => {
        console.log(values);
      },
    });
  return (
    <div className="flex gap-6 w-screen h-screen p-8 bg-white">
      <div className="w-1/4">
        <div className="flex flex-col gap-4">
          <div className="w-full h-44 bg-slate-200 rounded-md">
            <ModelViewer />
          </div>
          <Button block type="primary">
            Reupload Model
          </Button>
        </div>
      </div>
      <div className="flex-1">
        <>
          <div className="text-3xl">{STRINGS.NEW_ASSETS_UPLOAD}</div>
          <div className="mt-4">
            <Form layout="vertical">
              <Form.Item label={STRINGS.ASSET_NAME} required>
                <TooltipInputField message={errors.name ? errors.name : null}>
                  <Input
                    placeholder={STRINGS.ASSET_NAME}
                    name={"name"}
                    onChange={handleChange}
                    status={errors.name ? "error" : ""}
                  />
                </TooltipInputField>
              </Form.Item>
              <Form.Item label={STRINGS.ASSET_DESCRIPTION} required>
                <TooltipInputField
                  message={errors.description ? errors.description : null}
                >
                  <Input.TextArea
                    placeholder={STRINGS.ASSET_DESCRIPTION}
                    rows={3}
                    name={"description"}
                    onChange={handleChange}
                    status={errors.description ? "error" : ""}
                  />
                </TooltipInputField>
              </Form.Item>
              <Form.Item label={STRINGS.ASSET_TAGS} required>
                <TooltipInputField message={errors.tags ? errors.tags : null}>
                  <Select
                    mode="tags"
                    style={{ width: "100%" }}
                    placeholder={STRINGS.ASSET_TAGS}
                    onChange={(value) => {
                      setFieldValue("tags", value);
                    }}
                    options={[]}
                    maxTagCount={5}
                    status={errors.tags ? "error" : ""}
                  />
                </TooltipInputField>
              </Form.Item>
              <Form.Item label={STRINGS.ASSET_CATEGORIES} required>
                <TooltipInputField message={errors.tags ? errors.tags : null}>
                  <Select
                    mode="multiple"
                    style={{ width: "100%" }}
                    placeholder={STRINGS.ASSET_CATEGORIES}
                    onChange={(value) => {
                      setFieldValue("tags", value);
                    }}
                    options={[]}
                    maxTagCount={5}
                    status={errors.tags ? "error" : ""}
                  />
                </TooltipInputField>
              </Form.Item>
              <Button type="primary" onClick={() => handleSubmit()}>
                Add asset
              </Button>
            </Form>
          </div>
        </>
      </div>
      <div className="w-1/4">Hello</div>
    </div>
  );
};
