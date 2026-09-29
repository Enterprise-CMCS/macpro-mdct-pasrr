export default [
  {
    topicPrefix: "aws.mdct.pasrr",
    version: ".v0",
    numPartitions: 1,
    replicationFactor: 3,
    topics: [".pasrr-reports", ".pasrr-comments"],
  },
];
