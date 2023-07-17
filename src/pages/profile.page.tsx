import { Avatar, Col, Divider, Row, Tabs, TabsProps, Tag, Tooltip } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { MdOutlineEditNote } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { Projects } from "../components/projects";
import { ValueWithLabel } from "../components/valueWithLabel";
import { RootState, useAppSelector } from "../redux/store";
import { axiosInstance } from "../utils/axios";
import { apiRoutes } from "../utils/constants/apiRoutes";
import { getFullName } from "../utils/functions";
import { Loader } from "../components/loader";
import { BsInstagram } from "react-icons/bs";
import { FaLinkedinIn } from "react-icons/fa";
import { ImFacebook } from "react-icons/im";

export const ProfilePage = () => {
  const { userProfile } = useAppSelector((state: RootState) => state.user);
  const [profileData, setProfileData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    getProfileData();
  }, []);

  const getProfileData = async () => {
    try {
      setLoading(true);
      const resp = await axiosInstance.get(apiRoutes.getProfile);
      console.log(resp?.data?.data);
      setProfileData(resp?.data?.data || {});
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const items: TabsProps["items"] = [
    {
      key: "uploads",
      label: `Uploads`,
      children: (
        <div className="overflow-auto pb-4">
          <Projects />
        </div>
      ),
    },
    // {
    //   key: "repositories",
    //   label: `Repositories`,
    //   children: `Content of Tab Pane 2`,
    // },
    // {
    //   key: "contributions",
    //   label: `Contributions`,
    //   children: `Content of Tab Pane 3`,
    // },
    // {
    //   key: "tags",
    //   label: `Tags`,
    //   children: `Content of Tab Pane 4`,
    // },
  ];

  const navigateToEditProfile = () => {
    navigate("/profile/edit");
  };

  if (loading) {
    return (
      <div className="p-4">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      <div className="bg-slate-50 w-full h-full text-black overflow-auto">
        <div className="p-4">
          <Row gutter={[12, 12]}>
            <Col span={6}>
              <div className="flex flex-col items-center">
                <Avatar
                  src={
                    profileData?.profileImage ||
                    "https://picsum.photos/500/300?random=1"
                  }
                  shape="square"
                  className="rounded-xl drop-shadow-xl w-32 h-32"
                />
                <div className="mt-3 text-2xl flex items-center gap-2">
                  {getFullName(profileData)}{" "}
                  {
                    <Tooltip title={"Edit Profile"} placement="right">
                      <MdOutlineEditNote
                        className="cursor-pointer"
                        onClick={() => {
                          navigateToEditProfile();
                        }}
                      />
                    </Tooltip>
                  }
                  {/* <span className="ml-2">
                    <BsPatchCheck />
                  </span> */}
                </div>
                <div className="bg-[#FFF] w-full text-slat p-4 rounded-lg drop-shadow-xl flex flex-col gap-2 mt-4">
                  <div className="flex justify-around">
                    <div className="flex flex-col items-center">
                      <span>{profileData?.assets || 0}</span>
                      <span>Projects</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span>{profileData?.followers || 0}</span>
                      <span>Followers</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span>{profileData?.followings || 0}</span>
                      <span>Followings</span>
                    </div>
                  </div>
                  <div className="my-2 w-full">
                    <ValueWithLabel
                      label="Username"
                      value={profileData?.username}
                    />
                    <ValueWithLabel
                      label="Email Address"
                      value={profileData?.email}
                    />
                    <ValueWithLabel
                      label="Registered Since"
                      value={moment(profileData?.createdAt).format(
                        "DD MMMM YYYY"
                      )}
                    />
                    <ValueWithLabel
                      label="Profile Description"
                      value={profileData?.bio || "N/A"}
                      isRow={false}
                      hideTooltip
                    />
                    {Object.values(profileData?.socials).length > 1 ? (
                      <ValueWithLabel
                        label="Social Links"
                        value={
                          <div className="flex py-2 gap-4">
                            {profileData?.socials?.instgram ? (
                              <Link
                                to={profileData?.socials?.instgram}
                                target="_blank"
                              >
                                <BsInstagram
                                  size={18}
                                  className="cursor-pointer"
                                />
                              </Link>
                            ) : (
                              <></>
                            )}
                            {profileData?.socials?.linkedin ? (
                              <Link
                                to={profileData?.socials?.linkedin}
                                target="_blank"
                              >
                                <FaLinkedinIn
                                  size={18}
                                  className="cursor-pointer"
                                />
                              </Link>
                            ) : (
                              <></>
                            )}
                            {profileData?.socials?.facebook ? (
                              <Link
                                to={profileData?.socials?.facebook}
                                target="_blank"
                              >
                                <ImFacebook
                                  size={18}
                                  className="cursor-pointer"
                                />
                              </Link>
                            ) : (
                              <></>
                            )}
                          </div>
                        }
                        isRow={false}
                        hideTooltip
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                  {profileData?.tags?.length > 0 ? (
                    <>
                      <Divider className="border-slate-500" dashed />
                      <div className="flex flex-col items-start">
                        <span>Most used Tags</span>
                        <span className="mt-2 flex flex-wrap gap-y-2">
                          {profileData?.tags?.map((t: string) => {
                            return (
                              <Tag className="text-white bg-slate-600">{t}</Tag>
                            );
                          })}
                        </span>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </Col>
            <Col span={18}>
              <div>
                <Tabs defaultActiveKey="uploads" items={items} />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};
