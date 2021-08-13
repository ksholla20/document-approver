import ForgeUI, {
  Badge,
  Button,
  render,
  Fragment,
  Macro,
  MacroConfig,
  Text,
  TextField,
  useConfig,
  useEffect,
  useState,
  useProductContext,
  Table,
  Head,
  Cell,
  Row
 } from "@forge/ui";
import api, { properties, route } from '@forge/api';

const defaultConfig = {
  approvers: "",
};
const Config = () => {
  return (
    <MacroConfig>
      <TextField
        name="approvers"
        label="Comma Separated list of approvers"
        defaultValue={defaultConfig.name}
      />
    </MacroConfig>
  );
};


const App = () => {
  const {approvers} = useConfig() || defaultConfig;
  const { contentId } = useProductContext();
  const approverList = approvers.split(",");
  const [approvalStatus, setApprovalStatus] = useState(async () => {
    const status =
      (await properties.onConfluencePage(contentId).get("approvalStatus")) || {};
    return status;
  });
  const [currentUser, setCurrentUser] = useState(async () => {
    const user = await api.asUser().requestConfluence(route`/wiki/rest/api/user/current`);
    return user.json();
  });
  const [lastUpdated, setLastUpdated] = useState(async () => {
    const history = await api.asApp().requestConfluence(route`/wiki/rest/api/content/${contentId}/history`);
    return history.json();
  });
  const urlParam = approverList.join('&accountId=');
  const [userList, setUserList] = useState(async () => {
    const history = await api.asApp().requestConfluence(route(`//wiki/rest/api/user/bulk?accountId=${urlParam}`));
    return history.json();
  });

  return (
    <Fragment>
      <Table>
        <Head>
          <Cell>
            <Text content="Approver" />
          </Cell>
          <Cell>
            <Text content="Status" />
          </Cell>
        </Head>
        {userList && userList.results.map(approver => (
                <Row>
                  <Cell>
                    <Text>
                      {approver.displayName/*approverMap[approver]*/}
                    </Text>
                  </Cell>
                  <Cell>
                      {approvalStatus[approver.accountId]
                        && approvalStatus[approver.accountId].isApproved
                        && Date.parse(approvalStatus[approver.accountId].lastUpdated) >= Date.parse(lastUpdated.lastUpdated.when)
                        && <Text><Badge appearance="added" text="Approved" /> </Text>}
                      {approvalStatus[approver.accountId]
                        && approvalStatus[approver.accountId].isApproved
                        && Date.parse(approvalStatus[approver.accountId].lastUpdated) < Date.parse(lastUpdated.lastUpdated.when)
                        && <Text><Badge appearance="primary" text="Approved but modified" /> </Text>}
                      {!(approvalStatus[approver.accountId]
                        && approvalStatus[approver.accountId].isApproved)
                        && <Text><Badge appearance="removed" text="Not Approved" /> </Text>}
                  </Cell>
                  {
                  currentUser.accountId==approver.accountId &&
                  <Cell>
                      <Button text={(approvalStatus[approver.accountId]&&approvalStatus[approver.accountId].isApproved)?"unapprove":"approve"} onClick={()=>setApproval(approver.accountId, !(approvalStatus[approver.accountId] && approvalStatus[approver.accountId].isApproved))}></Button>
                  </Cell>
                  }
                </Row>
              ))}
      </Table>
     </Fragment>
  );
};

export const run = render(
  <Macro
    app={<App />}
  />
);
export const config = render(<Config />);
