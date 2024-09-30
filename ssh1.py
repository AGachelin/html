from paramiko import client, AutoAddPolicy
print("test successfull")
# command = "cd html;git pull;cat README.md"
command = "ls"
host = "test"
password = open("test.txt").read()
client = client.SSHClient()
client.set_missing_host_key_policy(AutoAddPolicy())
client.connect(host, username="agachelin", password=password)
_stdin, _stdout,_stderr = client.exec_command(command)
print(_stdout.read().decode())
client.close()
