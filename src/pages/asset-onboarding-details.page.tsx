import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Upload,
} from "antd";
import { useFormik } from "formik";
import React from "react";
import { BiInfoCircle } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import { ImageUpload } from "../components/image-upload";
import { Loader } from "../components/loader";
import { MultiModelUpload } from "../components/model-multi-upload";
import { StatusChip } from "../components/status-chip";
import TooltipInputField from "../components/tooltipInputField/tooltipInputField";
import {
  assetOnboardingDetails,
  assetUpdateByStatus,
  assetUpdateDetailsById,
  getAssetDetailsById,
  resetAssetState,
} from "../redux/assetOnboardingReducer";
import { RootState, useAppDispatch, useAppSelector } from "../redux/store";
import { assetValidationSchema } from "../utils/constants/schema";
import { STRINGS } from "../utils/constants/strings";

const { Option } = Select;
const { Dragger } = Upload;

interface IAssetOnboardingFormValue {
  name: string;
  description: string;
  price: number;
  currency: string;
  tags: string[];
  category: string[];
  models: never[];
  licenseAttribution: boolean;
  licenseNonCommercial: boolean;
  licenseNoDerivatives: boolean;
  licenseShareAlike: boolean;
}

export const AssetOnboadingDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [isLicenseModelOpen, setIsLicenseModelOpen] = React.useState(false);
  const { categories = [] } = useAppSelector((state: RootState) => state.user);
  const {
    isAssetModelCreateLoading,
    isAssetModelCreateSuccess,
    isAssetGetDetailsLoading,
    isAssetGetDetailsSuccess: assetDetails,
    isAssetUpdateStatusLoading,
  } = useAppSelector((state: RootState) => state.assetOnboarding);
  const dispatch = useAppDispatch();

  /**
   *
   * Get asset details by id
   *
   */
  React.useEffect(() => {
    if (params.id) {
      dispatch(getAssetDetailsById({ id: params.id }));
    } else {
      dispatch(resetAssetState());
    }
    return () => {
      dispatch(resetAssetState());
    };
  }, [params.id]);

  /**
   *
   * Navigating to asset details page for change
   *
   */
  React.useEffect(() => {
    if (!isAssetModelCreateLoading && isAssetModelCreateSuccess?._id) {
      navigate(`/asset-onboarding/details/${isAssetModelCreateSuccess._id}`);
    }
  }, [isAssetModelCreateLoading, isAssetModelCreateSuccess]);

  /**
   *
   * Formik methods with initial values
   *
   */
  const {
    values,
    errors,
    handleSubmit,
    handleChange,
    setFieldValue,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: assetDetails?.name || "",
      description: assetDetails?.description || "",
      price: assetDetails?.price || 100,
      currency: "USD",
      tags: assetDetails?.tags || [],
      category: assetDetails?.category?.map((cat) => cat._id) || [],
      models: [],
      priceModel: assetDetails?.priceModel || "paid",
      licenseAttribution: assetDetails?.license?.attribution || true,
      licenseNonCommercial: assetDetails?.license?.nonCommercial || false,
      licenseNoDerivatives: assetDetails?.license?.noDerivatives || false,
      licenseShareAlike: assetDetails?.license?.shareAlike || false,
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: assetValidationSchema,
    onSubmit: (values) => {
      const license = {
        attribution: values.licenseAttribution,
        nonCommercial: values.licenseNonCommercial,
        noDerivatives: values.licenseNoDerivatives,
        shareAlike: values.licenseShareAlike,
      };
      if (assetDetails?._id) {
        // Updating asset details by id
        dispatch(
          assetUpdateDetailsById({
            id: assetDetails?._id,
            values: {
              ...values,
              price: values?.priceModel === "free" ? 0 : values.price,
              license,
            },
          })
        );
      } else {
        // Creating new assets
        dispatch(
          assetOnboardingDetails({
            values: {
              ...values,
              price: values?.priceModel === "free" ? 0 : values.price,
              license,
            },
          })
        );
      }
    },
  });

  const getLicensesFromValue = (values: IAssetOnboardingFormValue) => {
    let licenses = [];
    if (values.licenseAttribution) {
      licenses.push("Attribution");
    }
    if (values.licenseNonCommercial) {
      licenses.push("Non-Commercial");
    }
    if (values.licenseNoDerivatives) {
      licenses.push("No Derivatives");
    }
    if (values.licenseShareAlike) {
      licenses.push("Share Alike");
    }
    return licenses.join(", ");
  };

  const publishNgonAsset = () => {
    dispatch(
      assetUpdateByStatus({
        id: assetDetails?._id,
        status:
          assetDetails?.status === "published" ? "onboarded" : "published",
      })
    );
  };

  const openLicenseModel = () => {
    setIsLicenseModelOpen(true);
  };

  const closeLicenseModel = () => {
    setIsLicenseModelOpen(false);
  };

  /**
   *
   * Showing Loader for details
   *
   */
  if (isAssetGetDetailsLoading || isAssetGetDetailsLoading) {
    return <Loader />;
  }
  return (
    <>
      <div className="flex gap-6 w-full p-8 bg-white">
        {assetDetails?._id && (
          <div className="w-1/4">
            <div className="flex flex-col gap-4">
              <Form layout="vertical">
                <div className="w-full rounded-md">
                  <Form.Item label={STRINGS.UPLOAD_ASSET_OTHER_MODEL}>
                    <MultiModelUpload id={assetDetails?._id || ""} />
                  </Form.Item>
                </div>
                <div className="w-full rounded-md">
                  <Form.Item label={STRINGS.UPLOAD_ASSET_IMAGE}>
                    <ImageUpload id={assetDetails?._id} />
                  </Form.Item>
                </div>
              </Form>
            </div>
          </div>
        )}
        <div className="flex-1">
          <>
            <div className="text-3xl flex items-end justify-between">
              <div className="flex items-end">
                {!assetDetails?._id
                  ? STRINGS.NEW_ASSETS_UPLOAD
                  : STRINGS.ASSET_DETAILS}
                {assetDetails?.status && (
                  <StatusChip status={assetDetails?.status} />
                )}
              </div>
              <div>
                <BiInfoCircle size={16} />
              </div>
            </div>
            <Row gutter={[12, 12]}>
              <Col span={16}>
                <div className="mt-4">
                  <Form layout="vertical">
                    <Form.Item label={STRINGS.ASSET_NAME} required>
                      <TooltipInputField
                        message={errors.name ? errors.name : null}
                      >
                        <Input
                          placeholder={STRINGS.ASSET_NAME}
                          name={"name"}
                          value={values.name}
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
                          className="!resize-none"
                          name={"description"}
                          value={values.description}
                          onChange={handleChange}
                          status={errors.description ? "error" : ""}
                        />
                      </TooltipInputField>
                    </Form.Item>
                    <Form.Item label={STRINGS.ASSET_TAGS} required>
                      <TooltipInputField
                        message={errors.tags ? errors.tags : null}
                      >
                        <Select
                          mode="tags"
                          style={{ width: "100%" }}
                          placeholder={STRINGS.ASSET_TAGS}
                          onChange={(value) => {
                            setFieldValue("tags", value);
                          }}
                          options={[]}
                          maxTagCount={5}
                          value={values.tags}
                          status={errors.tags ? "error" : ""}
                        />
                      </TooltipInputField>
                    </Form.Item>
                    <Form.Item label={STRINGS.ASSET_CATEGORIES} required>
                      <TooltipInputField
                        message={errors.tags ? errors.tags : null}
                      >
                        <Select
                          mode="multiple"
                          style={{ width: "100%" }}
                          placeholder={STRINGS.ASSET_CATEGORIES}
                          onChange={(value) => {
                            setFieldValue("category", value);
                          }}
                          value={values.category}
                          options={categories.map((category) => ({
                            label: category.label,
                            value: category._id,
                          }))}
                          maxTagCount={5}
                          status={errors.category ? "error" : ""}
                        />
                      </TooltipInputField>
                    </Form.Item>
                    <div className="flex gap-2">
                      <Button
                        type="primary"
                        onClick={() => handleSubmit()}
                        loading={isAssetModelCreateLoading}
                        disabled={isAssetModelCreateLoading}
                      >
                        {assetDetails?._id ? "Save Changes" : "Add asset"}
                      </Button>
                      {assetDetails?._id && (
                        <Button
                          type="primary"
                          onClick={() => publishNgonAsset()}
                          loading={isAssetUpdateStatusLoading}
                          disabled={isAssetUpdateStatusLoading}
                        >
                          {assetDetails?.status === "published"
                            ? "Unpublish"
                            : "Publish"}
                        </Button>
                      )}
                    </div>
                  </Form>
                </div>
              </Col>
              <Col span={8}>
                <div className="mt-4">
                  <Form layout="vertical">
                    <Form.Item label={STRINGS.ASSET_PRICE}>
                      <Radio.Group
                        value={values.priceModel}
                        name="priceModel"
                        className="w-full"
                        onChange={handleChange}
                      >
                        <Radio.Button value={"free"}>Free</Radio.Button>
                        <Radio.Button value={"paid"}>Paid</Radio.Button>
                      </Radio.Group>
                      {values.priceModel === "paid" && (
                        <TooltipInputField
                          message={errors.price ? errors.price : null}
                        >
                          <InputNumber
                            type={"number"}
                            className="w-full mt-4"
                            placeholder={STRINGS.ASSET_PRICE}
                            name={"price"}
                            value={values.price}
                            onChange={(value) => {
                              setFieldValue("price", value);
                            }}
                            status={errors.price ? "error" : ""}
                          />
                        </TooltipInputField>
                      )}
                    </Form.Item>
                  </Form>
                  <div className="h-20 pb-1">
                    <div>License</div>
                    <div className="h-full bg-slate-100 rounded-md mt-2 flex items-center justify-center flex-col">
                      <div className="text-center text-xs">
                        {!isLicenseModelOpen && getLicensesFromValue(values)}
                      </div>
                      <div
                        className="text-xs cursor-pointer leading-normal text-blue-300 hover:text-blue-600 transition-all"
                        onClick={openLicenseModel}
                      >
                        Change License
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </>
        </div>
      </div>
      <Modal
        open={isLicenseModelOpen}
        footer={null}
        onCancel={closeLicenseModel}
      >
        <div className="p-4">NGON Asset Licenses</div>
        <Divider dashed />
        <div className="p-4">
          <div>Select what others can and can't do:</div>
          <div className="mt-4">
            <div className="flex">
              <Checkbox
                disabled
                name="licenseAttribution"
                checked={values.licenseAttribution}
                onChange={handleChange}
              />
              <div className="ml-3">
                <label className="font-bold">Attribution</label>
                <div className="text-gray-400">
                  Others can distribute, remix, tweak, and build upon your work
                  as long as they credit you for the original creation.
                </div>
              </div>
            </div>
            <div className="flex mt-2">
              <Checkbox
                id="licenseNonCommercial"
                name="licenseNonCommercial"
                checked={values.licenseNonCommercial}
                onChange={handleChange}
              />
              <div className="ml-3">
                <label className="font-bold" htmlFor="licenseNonCommercial">
                  Non Commercial
                </label>
                <div className="text-gray-400">
                  Others can not use your work commercially.
                </div>
              </div>
            </div>
            <div className="flex mt-2">
              <Checkbox
                id="licenseNoDerivatives"
                name="licenseNoDerivatives"
                checked={values.licenseNoDerivatives}
                onChange={() => {
                  setFieldValue("licenseShareAlike", false);
                  setFieldValue(
                    "licenseNoDerivatives",
                    !values.licenseNoDerivatives
                  );
                }}
              />
              <div className="ml-3">
                <label className="font-bold" htmlFor="licenseNoDerivatives">
                  No derivatives
                </label>
                <div className="text-gray-400">
                  Others can redistribute as long as it is passed along
                  unchanged and in whole.
                </div>
              </div>
            </div>
            <div className="flex mt-2">
              <Checkbox
                id="licenseShareAlike"
                name="licenseShareAlike"
                checked={values.licenseShareAlike}
                onChange={() => {
                  setFieldValue("licenseNoDerivatives", false);
                  setFieldValue("licenseShareAlike", !values.licenseShareAlike);
                }}
              />
              <div className="ml-3">
                <label className="font-bold" htmlFor="licenseShareAlike">
                  Share alike
                </label>
                <div className="text-gray-400">
                  Others can remix, tweak, and build upon your work as long as
                  they license their new creations under the identical terms.
                </div>
              </div>
            </div>
          </div>
        </div>
        <Divider dashed />
        <div className="p-4">
          <div className="text-gray-400">
            Others can remix, tweak, and build upon your work as
          </div>
        </div>
      </Modal>
    </>
  );
};
