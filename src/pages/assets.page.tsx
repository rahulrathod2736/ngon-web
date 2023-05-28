import { Button, Collapse, Divider, Form, Input, Select } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader } from "../components/loader";
import { NgonAssetCard } from "../components/ngon-asset-card";
import { RootState, useAppDispatch, useAppSelector } from "../redux/store";
import { axiosInstance } from "../utils/axios";
import { apiRoutes } from "../utils/constants/apiRoutes";
import { showErrorMessage } from "../utils/functions";
import { INgonAsset } from "../utils/interface";
import _ from "lodash";

const { Panel } = Collapse;

const initialValues = {
  searchQuery: "",
  category: null,
  sortBy: "createdAt",
  order: "desc",
};

export const AssetsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);

  const [assets, setAssets] = useState<INgonAsset[]>([]);
  let filterQueries: Record<string, any> = {};
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isGetAssetsLoading } = useAppSelector(
    (state: RootState) => state.asset
  );
  const { categories = [] } = useAppSelector((state: RootState) => state.user);

  const { values, handleChange, setFieldValue, handleSubmit, resetForm } =
    useFormik({
      initialValues: {
        ...initialValues,
        searchQuery: urlParams.get("searchQuery") || "",
      },
      onSubmit: (values: Record<string, any>) => {
        applyFiltersToAssets(values);
      },
    });

  useEffect(() => {
    applyFiltersToAssets(values);
  }, []);

  const applyFiltersToAssets = async (values: Record<string, any>) => {
    try {
      setIsLoading(true);
      if (_.isEqual(filterQueries, values)) {
        return;
      }
      const filters: Record<string, string> = {};
      if (values.searchQuery) {
        filters.searchQuery = values.searchQuery;
      }
      if (values.category) {
        filters.category = values.category;
      }
      if (values.sortBy) {
        filters.sortBy = values.sortBy;
      }
      if (values.order) {
        filters.order = values.order;
      }
      filterQueries = { ...values };

      const query = new URLSearchParams(filters).toString();
      const response = await axiosInstance.get(`${apiRoutes.assets}?${query}`);
      setAssets(response.data.data);
    } catch (err) {
      showErrorMessage(err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = (event: any) => {
    event.stopPropagation();
    resetForm();
    applyFiltersToAssets(initialValues);
  };

  return (
    <div>
      <Collapse expandIconPosition={"end"} bordered={false}>
        <Panel
          header="Filters"
          key="filters"
          className="bg-white overflow-hidden"
          extra={
            <span onClick={clearFilters} className="cursor-pointer link">
              Clear Filters
            </span>
          }
        >
          <div className="flex flex-col gap-y-4">
            <Form layout="vertical">
              <div className="flex justify-between">
                <div className="flex gap-6 rounded">
                  <Form.Item className="pl-3 w-[250px]" label="Search Query">
                    <Input
                      placeholder="Search your query here..."
                      name="searchQuery"
                      value={values.searchQuery}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </Form.Item>
                  <Form.Item label="Category" className="w-[200px]">
                    <Select
                      placeholder="Category"
                      allowClear
                      value={values.category}
                      onChange={(value) => {
                        setFieldValue("category", value);
                      }}
                      showArrow={false}
                      options={categories.map((category) => ({
                        label: category.label,
                        value: category._id,
                      }))}
                      disabled={isLoading}
                    />
                  </Form.Item>
                </div>
                <div className="flex items-center gap-x-2">
                  <Form.Item label="Sort By" className="w-[200px]">
                    <Select
                      value={values.sortBy}
                      className="w-[150px]"
                      placeholder="Sort By"
                      showArrow={false}
                      onChange={(value) => {
                        setFieldValue("sortBy", value);
                      }}
                      options={[
                        { value: "name", label: "Name" },
                        { value: "price", label: "Price" },
                        { value: "likes", label: "Likes" },
                        { value: "comments", label: "Comments" },
                        { value: "createdAt", label: "Created Date" },
                      ]}
                      disabled={isLoading}
                    />
                  </Form.Item>
                  <Form.Item label="Order" className="w-[100px]">
                    <Select
                      value={values.order}
                      className="w-[150px]"
                      placeholder="Order"
                      showArrow={false}
                      onChange={(value) => {
                        setFieldValue("order", value);
                      }}
                      options={[
                        { value: "asc", label: "Asc" },
                        { value: "desc", label: "Desc" },
                      ]}
                      disabled={isLoading}
                    />
                  </Form.Item>
                </div>
              </div>
            </Form>
            <Divider dashed />
            <div className="text-right">
              <Button
                className="rounded-full"
                type="primary"
                onClick={() => {
                  handleSubmit();
                }}
                disabled={isLoading}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </Panel>
      </Collapse>

      <div className="grid grid-cols-4 gap-4 mt-8">
        {isGetAssetsLoading || isLoading ? (
          <Loader />
        ) : (
          assets.map((asset, i) => {
            return <NgonAssetCard asset={asset} key={asset._id} />;
          })
        )}
      </div>
    </div>
  );
};
