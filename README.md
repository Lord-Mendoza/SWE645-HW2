Steps for S3 Bucket Creation:
1. Go to S3 Service and click `Create Bucket`
2. Fill in bucket name `swe645-hw1-part1`
3. Uncheck `block all public access`
4. Click `Create Bucket`
5. Upload files to bucket (`error.html`, `index.html`, `profilePic.jpg`)
6. Go to `Permissions` tab and edit bucket policy to the following:
   >{ "Version": "2012-10-17", "Statement": [ { "Sid": "PublicReadGetObject", "Effect": "Allow", "Principal": "*", "Action": "s3:GetObject", "Resource": "arn:aws:s3:::swe645-hw1-part1/*" } ] }
7. Go to `Properties`
   1. Under `Static website hosting` click `Edit`
   2. Under `Static website hosting` click `Enable` 
   3. Specify index document as `index.html`
   4. Specify error document as `error.html`
   5. Click `Save Changes`
   6. You'll see the link to the website afterward

- S3 Part 1 Link: http://swe645-hw1-part1.s3-website-us-east-1.amazonaws.com
--------------
Steps for EC2 Instance Launch:
1. Go to EC2 Service and Click `Launch instance`
2. Fill in instance name `swe645-hw1-part2`
3. Under key pair (login):
   1. Select `Create new key pair`
   2. Type in a key pair name `swe645-hw1-part2-keypair`
   3. For `Private key file format` select `.ppk`
   4. Click `Create key pair`
4. Under `Network settings` > `Firewall (security groups)` 
   1. Select `Create security group` `swe645-securiygroup`
   2. Ensure that the security group has `Inbound rules` for Protocols
      1. `TCP` with source `My IP`
      2. `HTTP` with source `Anywhere-IPv4`
5. Select `Launch instance`
6. Copy the `Public IPv4 address` of the instance
7. Open `PuTTY` software on your local and ssh to the instance using the IPv4 address and use the `.ppk` key from prior and log in as `ec2-user`
8. Run the following commands:
   1. `sudo yum update -y` - updates the instance
   2. `sudo yum install -y httpd` - for running html files on ec2
   3. `sudo chmod 777 /var/www/html -R` - for enabling permissions to add files to new html folder used in next step
9. Copy local html files to directory `/var/www/html`, you can use `WinSCP`
10. Run the following commands to deploy html files:
    1. `sudo systemctl enable httpd`
    2. `sudo systemctl start httpd`
11. Access the instance using the IPv4 address from prior.

- EC2 Part 2 Link: http://54.167.103.197