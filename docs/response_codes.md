# Response codes #

	0x00000000 = "No error"
	0xC0000001 = "Library not initialized"
	0xC0000002 = "Buffer is not big enough"
	0xC0000003 = "Invalid parameters"
	0xC0000004 = "No permission"
	0xC0000006 = "No token available"
	0xC0000007 = "Invalid token handle"
	0xC0000008 = "Slot is full. No more token can be added"
	0xC0000009 = "Invalid slot"
	0xC0000010 = "Device error"
	0xC0000011 = "The token is already initialized"
	0xC0000012 = "Communication error"
	0xC0000013 = "PIN error"
	0xC0000014 = "User has been locked"
	0xC0000015 = "No more users can logon"
	0xC0000016 = "No such user available"
	0xC0000017 = "Device is not opened yet"
	0xC0000018 = "The key already exists"
	0xC0000019 = "No key available"
	0xC0000020 = "The token is full and can't generate new keys"
	0xC0000021 = "Key handle error"
	0xC0000022 = "Key generation failed"
	0xC0000023 = "Operation not allowed"
	0xC0000024 = "Invalid operation"

	0xCF000001 = "File initialization failed"
	0xCF000002 = "Not enough filesystem space"
	0xCF000003 = "Designated file offset is invalid"
	0xCF000004 = "Beyond data range"
	0xCF000005 = "The file is not opened"
	0xCF000006 = "No file"
	0xCF000007 = "End of file list"
	0xCF000008 = "Filename is too long"
	0xCF00000A = "The file already exists"

Sometimes you can get the following message:

	"The result of the method has code: 0x…"
That means the response code is not known by the plugin.
Please report us this code and try to describe the steps you have done to get it.