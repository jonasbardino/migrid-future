#include <stdio.h>	
#include <string.h>
#include <stdlib.h>
#include <netdb.h>
#include <arpa/inet.h>
#include "migauth.h"
#include "migauthhandler.c"

#ifndef BOOL2STR
#define BOOL2STR(x) x ? "true" : "false"
#endif

void unittest() 
{
	const char *pUsername = "dummy@dummy.dk";
	const char *pPassword = "TestPassword123";
	const char *pAddress = "127.0.0.1";
	char *pSecret = NULL;

	fprintf(stderr, "=====================================================\n");
	fprintf(stderr, "Testing mig_pyinit\n");
	fprintf(stderr, "=====================================================\n");
	bool init_status = mig_pyinit();
	fprintf(stderr, "init_status: %s\n", BOOL2STR(init_status));

	fprintf(stderr, "=====================================================\n");
	fprintf(stderr,  "Testing mig_scramble_digest\n");
	fprintf(stderr, "=====================================================\n");
	pSecret = mig_scramble_digest(pPassword);
	fprintf(stderr, "pSecret: %s\n", pSecret);

	fprintf(stderr, "=====================================================\n");
	fprintf(stderr,  "Testing mig_expire_rate_limit\n");
	fprintf(stderr, "=====================================================\n");
	int expired = mig_expire_rate_limit();
	fprintf(stderr, "expired: %d\n", expired);

	fprintf(stderr, "=====================================================\n");
	fprintf(stderr,  "Testing mig_hit_rate_limit\n");
	fprintf(stderr, "=====================================================\n");
	bool exceeded_rate_limit = mig_hit_rate_limit(pUsername, pAddress);
	fprintf(stderr, "exceeded_rate_limit: %s\n", BOOL2STR(exceeded_rate_limit));

	fprintf(stderr, "=====================================================\n");
	fprintf(stderr,  "Testing mig_exceeded_max_sessions\n");
	fprintf(stderr, "=====================================================\n");
	bool exceeded_max_sessions = mig_exceeded_max_sessions(pUsername, pAddress);
	fprintf(stderr, "exceeded_max_sessions: %s\n", BOOL2STR(exceeded_max_sessions));

	fprintf(stderr, "=====================================================\n");
	fprintf(stderr,  "Testing mig_validate_username\n");
	fprintf(stderr, "=====================================================\n");
	bool valid_username = mig_validate_username(pUsername);
	fprintf(stderr, "valid_username: %s\n", BOOL2STR(valid_username));

	fprintf(stderr, "=====================================================\n");
	fprintf(stderr,  "Testing register_auth_attempt\n");
	fprintf(stderr, "=====================================================\n");
	bool valid_auth = register_auth_attempt(MIG_SKIP_TWOFA_CHECK
                                       | MIG_AUTHTYPE_PASSWORD
                                       | MIG_AUTHTYPE_ENABLED
                      	               | MIG_VALID_AUTH, 
                      	               pUsername, pAddress, pSecret);
	fprintf(stderr, "valid_auth: %s\n", BOOL2STR(valid_auth));
	fprintf(stderr, "=====================================================\n");
	fprintf(stderr, "Testing mig_pyexit\n");
	fprintf(stderr, "=====================================================\n");
	bool exit_status = mig_pyexit();
	fprintf(stderr, "exit_status: %s\n", BOOL2STR(exit_status));
}

int main(int argc, char *argv[])
{	
	unittest();
}
