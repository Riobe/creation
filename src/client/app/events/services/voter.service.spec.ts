'use strict';

import { VoterService } from './voter.service';
import { ISession } from '../models';
import { Observable } from 'rxjs';

import { expect } from 'chai';
import { stub, match } from 'sinon';

describe('VoterService', function() {
  let voterService: VoterService,
      mockHttp;

  beforeEach(function() {
    mockHttp = {
      delete: stub().returns(Observable.of(false)),
      post: stub().returns(Observable.of(false))
    };
    voterService = new VoterService(mockHttp);
  });

  describe('#addVoter', function() {
    it('should call http.delete with the right URL.', function() {
      let session = {
            id: 6,
            voters: ['john' ]
          },
          expectedUrl = '/api/events/3/sessions/6/voters/joe';

      voterService.addVoter(3, session as ISession, 'joe');

      expect(mockHttp.post.calledOnce).to.be.true;
      expect(mockHttp.post.calledWith(expectedUrl, '{}', match.object)).to.be.true;
    });
  });

  describe('#deleteVoter', function() {
    it('should remove the voter from the list of voters.', function() {
      let session = {
        id: 6,
        voters: ['joe', 'john' ]
      };

      voterService.deleteVoter(3, session as ISession, 'joe');

      expect(session.voters).to.have.lengthOf(1);
      expect(session.voters[0]).to.equal('john');
      expect(session.voters).to.not.include('joe');
    });

    it('should call http.delete with the right URL.', function() {
      let session = {
            id: 6,
            voters: ['joe', 'john' ]
          },
          expectedUrl = '/api/events/3/sessions/6/voters/joe';

      voterService.deleteVoter(3, session as ISession, 'joe');

      expect(mockHttp.delete.calledOnce).to.be.true;
      expect(mockHttp.delete.calledWithExactly(expectedUrl)).to.be.true;
    });
  });
});
