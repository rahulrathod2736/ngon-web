import { Avatar, Badge, Col, Divider, Row, Tabs, Tag } from "antd";
import { Header } from "../components/header";
import { BsPatchCheck } from "react-icons/bs";
import type { TabsProps } from "antd";
import { Projects } from "../components/projects";

export const ProfilePage = () => {
  const onChange = (key: string) => {
    console.log(key);
  };

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
    {
      key: "repositories",
      label: `Repositories`,
      children: `Content of Tab Pane 2`,
    },
    {
      key: "contributions",
      label: `Contributions`,
      children: `Content of Tab Pane 3`,
    },
    {
      key: "tags",
      label: `Tags`,
      children: `Content of Tab Pane 4`,
    },
  ];

  return (
    <div className="h-screen w-screen bg-white">
      <Header />
      <div className="bg-slate-50 w-full h-full pt-[88px] text-black overflow-auto">
        <div className="p-4">
          <Row gutter={[12, 12]}>
            <Col span={16}>
              <div>
                <Tabs
                  defaultActiveKey="uploads"
                  items={items}
                  onChange={onChange}
                />
              </div>
            </Col>
            <Col span={8}>
              <div className="flex flex-col items-center">
                <Avatar
                  src="https://picsum.photos/500/300?random=1"
                  shape="square"
                  className="rounded-xl drop-shadow-xl w-32 h-32"
                />
                <div className="mt-3 text-2xl">
                  Rahul Rathod
                  {/* <span className="ml-2">
                    <BsPatchCheck />
                  </span> */}
                </div>
                <div className="bg-[#0B466B] w-full text-white p-4 rounded-lg drop-shadow-lg flex flex-col gap-2 mt-4">
                  <div className="flex justify-around">
                    <div className="flex flex-col items-center">
                      <span>8</span>
                      <span>Projects</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span>8</span>
                      <span>Followers</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span>8</span>
                      <span>Followings</span>
                    </div>
                  </div>
                  <div className="my-2">
                    <div>rahulrathod2736</div>
                    <div>Surat, Gujarat</div>
                    <div>Description</div>
                  </div>
                  <Divider className="border-slate-500" dashed />
                  <div className="flex flex-col items-start">
                    <span>Most used Tags</span>
                    <span className="mt-2">
                      <Tag className="text-white bg-slate-600">Gaming</Tag>
                      <Tag className="text-white bg-slate-600">Architecture</Tag>
                      <Tag className="text-white bg-slate-600">Interior</Tag>
                      <Tag className="text-white bg-slate-600">Archviz</Tag>
                    </span>
                  </div>
                  <Divider className="border-slate-500" dashed />
                  <div className="flex flex-col gap-4 items-center my-2">
                    <div className="px-4 py-2 bg-red-400 w-full rounded-md text-center">5.2k Sells</div>
                    <div className="px-4 py-2 bg-green-400 w-full rounded-md text-center">54k Likes</div>
                    <div className="px-4 py-2 bg-purple-400 w-full rounded-md text-center">5.2k Shares</div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};
