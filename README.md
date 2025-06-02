# BlockPerformance

*Discover Your Blockchain's True Limits.*

This tool helps you automate blockchain performance testing. It can set up a test cluster for you with one click and send large-scale requests to test the upper limits of your blockchain system's request processing capabilities.

This tool was originally used by our team to test the performance of BrokerChain, and we also use it to test other existing blockchain systems. This allows us to compare the performance of different blockchain systems in a more engineering-oriented way. You can also use it to test your own blockchain system.

# Prerequisites

Before using this tool, please ensure you have your own AWS account and have created an API Key. This tool will use it to request AWS to perform operations such as creating servers. Additionally, you need to be familiar with the Apache JMeter testing tool. You should understand how to use it, and most importantly, you need to have created a test plan (a text file) using this tool. If you are not yet familiar with Apache JMeter, you can visit its official website to learn how to use it.

# How does it work

This tool automatically calls the Amazon Web Services (AWS) API to allocate a specified number of servers for you and configures them into an Apache JMeter cluster. One of these servers will be the Master server, and the rest will be Slave servers. You can send your test plan to the Master server, which will then execute your test plan and generate the final test report. The entire process is fully automated.


# How to use it

Three steps to use it:

Step 1 - Create an Apache JMeter Cluster (on AWS).

Step 2 - Run your test plan on the master server and download the report.

Step 3 - Terminate the cluster. (All servers will be terminated, saving you money.)
