import { Snowflake } from "nodejs-snowflake";

const snowflakeClient = new Snowflake({
  custom_epoch: 0,
  instance_id: 1,
});

export default snowflakeClient;
