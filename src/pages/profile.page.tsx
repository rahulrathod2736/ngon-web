import { Avatar, Col, Divider, Row, Tabs, TabsProps, Tag } from "antd";
import moment from "moment";
import { Projects } from "../components/projects";
import { ValueWithLabel } from "../components/valueWithLabel";
import { RootState, useAppSelector } from "../redux/store";
import { getFullName } from "../utils/functions";

export const ProfilePage = () => {
  const { userProfile } = useAppSelector((state: RootState) => state.user);

  const items: TabsProps["items"] = [
    {
      key: "uploads",
      label: `Uploads`,
      children: (
        <div className="h-[66vh] overflow-auto pb-4">
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

  return (
    <div className="h-screen w-screen bg-white">
      <div className="bg-slate-50 w-full h-full text-black overflow-auto">
        <div className="p-4">
          <Row gutter={[12, 12]}>
            <Col span={24} lg={9}>
              <div className="flex flex-col items-center">
                <Avatar
                  src="https://picsum.photos/500/300?random=1"
                  shape="square"
                  className="rounded-xl drop-shadow-xl w-32 h-32"
                />
                <div className="mt-3 text-2xl">
                  {getFullName(userProfile)}
                  {/* <span className="ml-2">
                    <BsPatchCheck />
                  </span> */}
                </div>
                <div className="bg-[#FFF] w-full text-slat p-4 rounded-lg drop-shadow-xl flex flex-col gap-2 mt-4">
                  <div className="flex justify-around">
                    <div className="flex flex-col items-center">
                      <span>{userProfile?.assets || 0}</span>
                      <span>Projects</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span>{userProfile?.followers || 0}</span>
                      <span>Followers</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span>{userProfile?.followings || 0}</span>
                      <span>Followings</span>
                    </div>
                  </div>
                  <div className="my-2 w-full">
                    <ValueWithLabel
                      label="Username"
                      value={userProfile?.username}
                    />
                    <ValueWithLabel
                      label="Email Address"
                      value={userProfile?.email}
                    />
                    <ValueWithLabel
                      label="Registered Since"
                      value={moment(userProfile?.createdAt).format(
                        "DD MMMM YYYY"
                      )}
                    />
                  </div>
                  {userProfile?.tags?.length > 0 ? (
                    <>
                      <Divider className="border-slate-500" dashed />
                      <div className="flex flex-col items-start">
                        <span>Most used Tags</span>
                        <span className="mt-2 flex flex-wrap gap-y-2">
                          {userProfile?.tags?.map((t: string) => {
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
            <Col span={24} lg={15}>
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
