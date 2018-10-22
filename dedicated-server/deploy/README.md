# deploy

```bash
 # place the service file in /etc/systemd/system/
 #
 sudo cp screenshot-bot.service /etc/systemd/system/screenshot-bot.service
```

# Networking

Note that the server runs on port 8890, so you will need to redirect port 80 traffic to port 8890 due to Ubuntu's security restrictions.

```bash
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8890
```
