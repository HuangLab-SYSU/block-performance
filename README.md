# What is BlockPerformance?

*Discover Your Blockchain's True Limits.*

This tool helps you automate blockchain performance testing. It can set up a test cluster for you with one click and send large-scale requests to test the upper limits of your blockchain system's request processing capabilities.

This tool was originally used by our team to test the performance of BrokerChain, and we also use it to test other existing blockchain systems. This allows us to compare the performance of different blockchain systems in a more engineering-oriented way. You can also use it to test your own blockchain system.

# Prerequisites

Before using this tool, please ensure you have your own Amazon Web Services (AWS) account and have created an API Key. This tool will use it to request AWS to perform operations such as creating servers.

Additionally, you need to be familiar with the Apache JMeter testing tool. You should understand how to use it, and most importantly, you need to have created a test plan (a text file) using this tool. If you are not yet familiar with Apache JMeter, you can visit its official website to learn how to use it.

Running this tool requires Node.js, so please ensure it is installed on your computer. Additionally, if you need to build this repository's code from scratch, you will also need Docker installed on your computer.

# How does it work?

This tool automatically calls the Amazon Web Services (AWS) API to allocate a specified number of servers for you and configures them into an Apache JMeter cluster. One of these servers will be the Master server, and the rest will be Slave servers. You can send your test plan to the Master server, which will then execute your test plan and generate the final test report. The entire process is fully automated.

# How to use it?

Three steps to use it:

## Step 1 - Create an Apache JMeter Cluster (on AWS).

Execute the following in your command line terminal:

```bash
node jmeter-cluster-create
```

Follow the prompts in your command line terminal to enter the `slave_server_count` and your AWS API KEY information, specifically `access_key_id` and `secret_access_key`. The program will then allocate the specified number of servers.

This step will take some time as each server will install the necessary software from scratch. Please be patient.

## Step 2 - Run your test plan on the master server and download the report.

Now you can use the cluster you've created for testing. Please have your `.jmx` file ready (this is the text file JMeter uses to describe your test plan), then execute the following in your command line:

```bash
node jmeter-cluster-run
```

Follow the prompts to provide the following information:

- `local_test_plan_file_path`: This parameter specifies the complete path to your `.jmx` file.
- `download_jtl_file_to_path`: This parameter indicates where you want to download the generated `.jtl` data file to your local computer after the test is complete.
- `download_html_report_directory_to_path`: This parameter specifies where you want to download the generated HTML report (an entire folder) to your local computer after the test is complete.

Depending on the complexity of your test, this step can take a very short or a very long time to execute. Once the test successfully finishes, you will see the test data file and the corresponding HTML report on your local computer.

You can repeat this step as many times as needed until you achieve satisfactory results. However, please avoid starting a new test before the current one has finished. A server cluster can only execute one test at a time.

## Step 3 - Remove the cluster. (All servers will be terminated, saving you money.)

Finally, don't forget to release all the servers; otherwise, you'll continue to be billed by AWS. Similar to before, you'll need to provide your AWS API key information.

```bash
node jmeter-cluster-remove
```

And that's it! These are the primary steps for using BlockPerformance.
